import UserService from "../service/UserService.js";

class UserController {
    async getUser(req, res) {
        return res.send(await UserService.getUser(req.userId));
    }

    async getSessions(req, res) {
        return res.send(await UserService.getSessions(req.userId));
    }

    async logout(req, res) {
        return res.send(await UserService.logout(req.query.sessionId));
    }

    async logAllOut(req, res) {
        res.cookie("refreshToken", null, {expire: 0});
        return res.send(await UserService.logAllOut(req.userId));
    }
}

export default new UserController();
