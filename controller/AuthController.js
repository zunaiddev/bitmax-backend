import SignupReq from "../dto/SignupReq.js";
import LoginReq from "../dto/LoginReq.js";
import AuthService from "../service/AuthService.js";
import EmailVerifyReq from "../dto/EmailVerifyReq.js";
import PhoneVerifyReq from "../dto/PhoneVerifyReq.js";
import EmailReq from "../dto/ResendEmailOtpReq.js";
import ResendPhoneOtpReq from "../dto/ResendPhoneOtpReq.js";
import getDeviceInfo from "../utils/getDeviceInfo.js";
import LoginWithOtpReq from "../dto/LoginWithOtpReq.js";
import ResetPasswordReq from "../dto/ResetPasswordReq.js";

class AuthController {
    async signup(req, res) {
        const signupReq = new SignupReq(req.body);

        return res.status(201).send(await AuthService.signup(signupReq));
    }

    async login(req, res) {
        const loginReq = new LoginReq(req.body);
        const deviceInfo = getDeviceInfo(req);

        const {sessionId, accessToken, refreshToken} = await AuthService.login(loginReq, deviceInfo);

        res.cookie("refreshToken", refreshToken, {httpOnly: true});
        return res.send({sessionId, accessToken, refreshToken});
    }

    async loginWithOtp(req, res) {
        const {email, otp} = new LoginWithOtpReq(req.body);
        const deviceInfo = getDeviceInfo(req);

        const {sessionId, accessToken, refreshToken} =
            await AuthService.login({email, password: null}, deviceInfo, true, otp);

        res.cookie("refreshToken", refreshToken, {httpOnly: true});
        return res.send({sessionId, accessToken, refreshToken});
    }

    async requestLoginOtp(req, res) {
        const {email} = new EmailReq(req.body);
        return res.send(await AuthService.requestLoginOtp(email));
    }

    async resendEmailOtp(req, res) {
        const {email} = new EmailReq(req.body);
        return res.status(200).send(await AuthService.resendEmailOtp(email));
    }

    async resendPhoneOtp(req, res) {
        const {phone} = new ResendPhoneOtpReq(req.body);
        return res.status(200).send(await AuthService.resendPhoneOtp(phone));
    }

    async verifyEmail(req, res) {
        const emailReq = new EmailVerifyReq(req.body);
        return res.status(200).send(await AuthService.verifyEmail(emailReq));
    }

    async verifyPhone(req, res) {
        const phoneReq = new PhoneVerifyReq(req.body);
        return res.status(200).send(await AuthService.verifyPhone(phoneReq));
    }

    async forgotPassword(req, res) {
        const {email} = new EmailReq(req.body);

        return res.send(await AuthService.forgotPassword(email));
    }

    async resetPassword(req, res) {
        const resetPasswordReq = new ResetPasswordReq(req.body);

        return res.send(await AuthService.resetPassword(resetPasswordReq));
    }
}

export default new AuthController();
