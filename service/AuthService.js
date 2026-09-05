import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import SignupRes from "../dto/SignupRes.js";
import bcrypt from "bcrypt";
import JwtService from "./JwtService.js";
import UserRepo from "../repository/UserRepo.js";
import OtpService from "./OtpService.js";
import UserSessionService from "./UserSessionService.js";

class AuthService {
    async signup({name, email, phone, password}) {
        console.log(name, email, phone, password);
        const existingUser = await UserRepo.findByEmailOrPhoneNumber(email, phone);

        if (existingUser) {
            throw new CustomError(HttpStatusCode.Conflict, "User already exists with this email or phone", {
                id: existingUser._id,
                emailVerified: existingUser.isEmailVerified,
                phoneVerified: existingUser.isPhoneVerified
            });
        }

        const user = await UserRepo.save({
            name, email, phone, password: bcrypt.hashSync(password, 10),
        });

        const emailOtp = await OtpService.generateOtp(user, "VERIFY_EMAIL");
        const phoneOtp = await OtpService.generateOtp(user, "VERIFY_PHONE");

        console.log("Email Otp: ", emailOtp);
        console.log("Phone Otp: ", phoneOtp);

        return new SignupRes(user);
    }

    async login({email, password}, {deviceIp, deviceType, deviceName} = {}, withOtp = false, otp) {
        const user = await UserRepo.findByEmail(email);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, "User not found");
        }

        if (user.lockUntil > Date.now()) {
            throw new CustomError(HttpStatusCode.Unauthorized, "You are not allowed to login try again after some time");
        }

        if (withOtp) {
            await OtpService.validateOtp(user, "LOGIN", otp);
        } else if (!bcrypt.compareSync(password, user.password)) {
            let failedLoginAttempts = user.failedLoginAttempts;

            if (failedLoginAttempts >= 5) {
                await user.updateOne({failedLoginAttempts: 0, lockUntil: new Date(Date.now() + 10 * 60 * 1000)});
            } else {
                await user.updateOne({failedLoginAttempts: ++failedLoginAttempts});
            }

            throw new CustomError(HttpStatusCode.Unauthorized, "Invalid Password");
        }

        if (!(user.isEmailVerified && user.isPhoneVerified)) {
            throw new CustomError(HttpStatusCode.Forbidden, "Please verify your email and phone");
        }

        await user.updateOne({failedLoginAttempts: 0, lockedUntil: null});


        const accessToken = JwtService.generateToken(user._id, "AUTH", "15m");
        const refreshToken = JwtService.generateToken(user._id, "REFRESH", "30d");

        const session = await UserSessionService.newSession(user, accessToken, refreshToken, deviceIp, deviceType, deviceName);

        return {accessToken, refreshToken, sessionId: session._id};
    }

    async resendEmailOtp(email) {
        const user = await UserRepo.findByEmail(email);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, `User with ${email} not found`);
        }

        if (user.isEmailVerified) {
            throw new CustomError(HttpStatusCode.Conflict, `${email} already verified`);
        }

        const otp = await OtpService.generateOtp(user, "VERIFY_EMAIL");

        console.log("Email Resend Otp: ", otp);

        return "Otp Resend Successfully!";
    }

    async resendPhoneOtp(phone) {
        const user = await UserRepo.findByPhone(phone);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, `User with ${phone} not found`);
        }

        if (user.isPhoneVerified) {
            throw new CustomError(HttpStatusCode.Conflict, `${phone} already verified`);
        }

        const otp = await OtpService.generateOtp(user, "VERIFY_PHONE");

        console.log("Phone Resend Otp: ", otp);

        return "Otp Resend Successfully!";
    }

    async verifyEmail({email, otp}) {
        const user = await UserRepo.findByEmail(email);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, `User with ${email} not found`);
        }

        if (user.isEmailVerified) {
            throw new CustomError(HttpStatusCode.Conflict, `${email} already verified`);
        }

        await OtpService.validateOtp(user, "VERIFY_EMAIL", otp);
        await user.updateOne({isEmailVerified: true});

        return "Email Verification Successful";
    }

    async verifyPhone({phone, otp}) {
        const user = await UserRepo.findByPhone(phone);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, `User with ${phone} not found`);
        }

        if (user.isPhoneVerified) {
            throw new CustomError(HttpStatusCode.Conflict, `${phone} already verified`);
        }

        await OtpService.validateOtp(user, "VERIFY_PHONE", otp);
        await user.updateOne({isPhoneVerified: true});

        return "Phone Verification Successful";
    }

    async requestLoginOtp(email) {
        const user = await UserRepo.findByEmail(email);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, "User not found");
        }

        if (user.lockUntil > Date.now()) {
            throw new CustomError(HttpStatusCode.Unauthorized, "You are not allowed to login try again after some time");
        }

        const otp = await OtpService.generateOtp(user, "LOGIN");
        console.log("Login Otp: ", otp);

        return "Otp Sent Successfully!";
    }

    async forgotPassword(email) {
        const user = await UserRepo.findByEmail(email);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, `User with ${email} not found`);
        }

        const otp = await OtpService.generateOtp(user, "RESET_PASSWORD");
        console.log("ForgotPassword: ", otp);

        return "Otp sent Successfully!";
    }

    async resetPassword({email, password, otp}) {
        const user = await UserRepo.findByEmail(email);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, `User with ${email} not found`);
        }

        await OtpService.validateOtp(user, "RESET_PASSWORD", otp);

        await user.updateOne({password: bcrypt.hashSync(password, 10)});
        await UserSessionService.deleteAll(user);

        return "Password updated successfully!";
    }
}

export default new AuthService();