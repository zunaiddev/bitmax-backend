import SignupReq from "../dto/SignupReq.js";
import LoginReq from "../dto/LoginReq.js";
import AuthService from "../service/AuthService.js";
import EmailVerifyReq from "../dto/EmailVerifyReq.js";

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

    async verifyEmail(req, res) {
        const emailReq = new EmailVerifyReq(req.body);
        const userResponse = await AuthService.verifyEmail(emailReq);

        res.cookie("refreshToken", userResponse.refreshToken, {httpOnly: true});

        return res.status(200).send({token: userResponse.token});
    }

    async forgotPassword(req, res) {

    }
}

export default new AuthController();
