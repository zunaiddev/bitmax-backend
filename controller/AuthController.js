import SignupReq from "../dto/SignupReq.js";
import LoginReq from "../dto/LoginReq.js";
import AuthService from "../service/AuthService.js";
import EmailVerifyReq from "../dto/EmailVerifyReq.js";
import PhoneVerifyReq from "../dto/PhoneVerifyReq.js";

class AuthController {
    async signup(req, res) {
        const signupReq = new SignupReq(req.body);

        return res.status(201).send(await AuthService.signup(signupReq));
    }

    async login(req, res) {
        const loginReq = new LoginReq(req.body);
        const {token, refreshToken} = await AuthService.login(loginReq);

        res.cookie("refreshToken", refreshToken, {httpOnly: true});
        return res.send({token});
    }

    async resendEmailOtp(req, res) {
        const {email} = req.body;
        return res.status(200).send(await AuthService.resendEmailOtp({email}));
    }

    async resendPhoneOtp(req, res) {
        const {phone} = req.body;
        return res.status(200).send(await AuthService.resendPhoneOtp({phone}));
    }

    async verifyEmail(req, res) {
        const emailReq = new EmailVerifyReq(req.body);
        return res.status(200).send(await AuthService.verifyEmail(emailReq));
    }

    async verifyPhone(req, res) {
        const phoneReq = new PhoneVerifyReq(req.body);
        return res.status(200).send(await AuthService.verifyPhone(phoneReq));
    }
}

export default new AuthController();
