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
            throw new CustomError(HttpStatusCode.Conflict, "User already exists with this email or phone", "USER_ALREADY_EXISTS", {
                id: existingUser._id,
                email: {value: existingUser.email, verified: existingUser.isEmailVerified},
                phone: {value: existingUser.phone, verified: existingUser.isPhoneVerified}
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
            throw new CustomError(HttpStatusCode.BadRequest, `${email} does not exist`, "NO_USER_FOUND");
        }

        if (user.lockUntil > Date.now()) {
            throw new CustomError(HttpStatusCode.Locked, "User is locked", "USER_LOCKED");
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

            throw new CustomError(HttpStatusCode.Unauthorized, "Invalid Password", "INVALID_PASSWORD");
        }

        if (!(user.isEmailVerified && user.isPhoneVerified)) {
            throw new CustomError(HttpStatusCode.Forbidden, "Please verify your email and phone", "NOT_VERIFIED", {
                email: {value: user.email, verified: user.isEmailVerified},
                phone: {value: user.phone, verified: user.isPhoneVerified}
            });
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
            throw new CustomError(HttpStatusCode.NotFound, `User with ${email} not found`, "NO_USER_FOUND");
        }

        if (user.isEmailVerified) {
            throw new CustomError(HttpStatusCode.Conflict, `${email} already verified`, "EMAIL_ALREADY_VERIFIED");
        }

        const otp = await OtpService.generateOtp(user, "VERIFY_EMAIL");

        console.log("Email Resend Otp: ", otp);

        return "Otp Resend Successfully!";
    }

    async resendPhoneOtp(phone) {
        const user = await UserRepo.findByPhone(phone);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, `User with ${phone} not found`, "NO_USER_FOUND");
        }

        if (user.isPhoneVerified) {
            throw new CustomError(HttpStatusCode.Conflict, `${phone} already verified`, "PHONE_ALREADY_VERIFIED");
        }

        const otp = await OtpService.generateOtp(user, "VERIFY_PHONE");

        console.log("Phone Resend Otp: ", otp);

        return "Otp Resend Successfully!";
    }

    async verifyEmail({email, otp, deviceIp, deviceType, deviceName}) {
        const user = await UserRepo.findByEmail(email);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, `User with ${email} not found`, "NO_USER_FOUND");
        }

        if (user.isEmailVerified) {
            throw new CustomError(HttpStatusCode.Conflict, `${email} already verified`, "EMAIL_ALREADY_VERIFIED");
        }

        await OtpService.validateOtp(user, "VERIFY_EMAIL", otp);
        await user.updateOne({isEmailVerified: true});


        if (user.isPhoneVerified) {
            const accessToken = JwtService.generateToken(user._id, "AUTH", "15m");
            const refreshToken = JwtService.generateToken(user._id, "REFRESH", "30d");

            const session = await UserSessionService.newSession(user, accessToken, refreshToken, deviceIp, deviceType, deviceName);

            return {accessToken, refreshToken, sessionId: session._id};
        }

        return {
            phone: {value: user.phone, verified: false}
        }
    }

    async verifyPhone({phone, otp, deviceIp, deviceType, deviceName}) {
        const user = await UserRepo.findByPhone(phone);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, `User with ${phone} not found`, "NO_USER_FOUND");
        }

        if (user.isPhoneVerified) {
            throw new CustomError(HttpStatusCode.Conflict, `${phone} already verified`, "PHONE_ALREADY_VERIFIED");
        }

        await OtpService.validateOtp(user, "VERIFY_PHONE", otp);
        await user.updateOne({isPhoneVerified: true});

        if (user.isEmailVerified) {
            const accessToken = JwtService.generateToken(user._id, "AUTH", "15m");
            const refreshToken = JwtService.generateToken(user._id, "REFRESH", "30d");

            const session = await UserSessionService.newSession(user, accessToken, refreshToken, deviceIp, deviceType, deviceName);

            return {accessToken, refreshToken, sessionId: session._id};
        }

        return {
            email: {value: user.email, verified: false}
        }
    }

    async requestLoginOtp(email) {
        const user = await UserRepo.findByEmail(email);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, "User not found", "NO_USER_FOUND");
        }

        if (user.lockUntil > Date.now()) {
            throw new CustomError(HttpStatusCode.Unauthorized, "You are not allowed to login try again after some time", "USER_LOCKED");
        }

        const otp = await OtpService.generateOtp(user, "LOGIN");
        console.log("Login Otp: ", otp);

        return "Otp Sent Successfully!";
    }

    async forgotPassword(email) {
        const user = await UserRepo.findByEmail(email);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, `User with ${email} not found`, "NO_USER_FOUND");
        }

        const otp = await OtpService.generateOtp(user, "RESET_PASSWORD");
        console.log("ForgotPassword: ", otp);

        return "Otp sent Successfully!";
    }

    async resetPassword({email, password, otp}) {
        const user = await UserRepo.findByEmail(email);

        if (!user) {
            throw new CustomError(HttpStatusCode.NotFound, `User with ${email} not found`, "NO_USER_FOUND");
        }

        await OtpService.validateOtp(user, "RESET_PASSWORD", otp);

        await user.updateOne({password: bcrypt.hashSync(password, 10)});
        await UserSessionService.deleteAll(user);

        return "Password updated successfully!";
    }
}

export default new AuthService();