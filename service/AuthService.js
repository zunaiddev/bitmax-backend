import User from "../model/User.js";
import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import SignupRes from "../dto/SignupRes.js";
import generateOtp from "../utils/generateOtp.js";
import OtpPurpose from "../utils/OtpPurpose.js";
import bcrypt from "bcrypt";
import JwtService from "./JwtService.js";
import EmailService from "./EmailService.js";

class AuthService {
    async signup(signupReq) {
        const {name, email, phone, password} = signupReq;
        const normalizedEmail = String(email).trim().toLowerCase();
        const existingUser = await User.findOne({email: normalizedEmail});

        if (existingUser && existingUser.isVerified) {
            throw new CustomError(HttpStatusCode.Conflict, "User already exists with this email");
        }

        const otp = generateOtp();
        const userData = {
            name, email: normalizedEmail, phone,
            password: bcrypt.hashSync(password, 10),
            otpHash: bcrypt.hashSync(otp, 10),
            otpPurpose: OtpPurpose.VERIFY_EMAIL,
            lastOtpSentAt: Date.now(),
            otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000)
        }

        let user;
        if (!existingUser) {
            user = await User.create(userData);
        } else {
            existingUser.set(userData);
            user = await existingUser.save();
        }

        await EmailService.sendOtpEmail(user.email, otp, user.name);

        return new SignupRes(user);
    }

    async verifyEmail(otpReq) {
        const {email, otp} = otpReq;

        const user = await User.findOne({email});

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, "User does not exist with this email");
        }

        if (user.isVerified) {
            throw new CustomError(HttpStatusCode.Conflict, "this user has already been verified");
        }

        if (user.otpAttempts >= 5) {
            throw new CustomError(HttpStatusCode.Forbidden, "You have reached max number of otp attempts request a new otp");
        }

        if (!bcrypt.compareSync(otp, user.otpHash)) {
            await user.updateOne({otpAttempts: ++user.otpAttempts});
            throw new CustomError(HttpStatusCode.Unauthorized, "Invalid OTP");
        }

        if (user.otpExpiresAt < Date.now()) {
            throw new CustomError(HttpStatusCode.Unauthorized, "OTP Expired Request a new one");
        }

        await user.updateOne({
            $set: {
                isVerified: true,
                lastOtpSentAt: null,
                otpHash: null,
                otpAttempts: 0,
                otpPurpose: null,
            }
        });

        return {
            token: JwtService.generateToken(user._id, "AUTH", "15m"),
            refreshToken: JwtService.generateToken(user._id, "REFRESH", "30d")
        };
    }

    async login(loginReq) {
        console.log(loginReq);
        const {email, password} = loginReq;
        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({email: normalizedEmail});

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, "User not found");
        }

        if (user.lockUntil > Date.now()) {
            throw new CustomError(HttpStatusCode.Unauthorized, "You are not allowed to login try again after some time");
        }

        if (!bcrypt.compareSync(password, user.password)) {
            let failedLoginAttempts = user.failedLoginAttempts;

            if (failedLoginAttempts >= 5) {
                await user.updateOne({failedLoginAttempts: 0, lockUntil: new Date(Date.now() + 10 * 60 * 1000)});
            } else {
                await user.updateOne({failedLoginAttempts: ++failedLoginAttempts});
            }

            throw new CustomError(HttpStatusCode.Unauthorized, "Invalid Password");
        }

        if (!user.isVerified) {
            throw new CustomError(HttpStatusCode.Forbidden, "Please Verify your email");
        }

        await user.updateOne({failedLoginAttempts: 0, lockedUntil: null});

        return {
            token: JwtService.generateToken(user._id, "AUTH", "15m"),
            refreshToken: JwtService.generateToken(user._id, "REFRESH", "30d")
        };
    }

    async resetPassword(user) {

    }

    async resendOtp(email) {

    }
}

export default new AuthService();
