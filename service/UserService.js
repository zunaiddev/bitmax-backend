import UserRepo from "../repository/UserRepo.js";
import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import UserSessionService from "./UserSessionService.js";

class UserService {
    async getUser(userId) {
        return await this.#getUser(userId);
    }

    async getSessions(userId) {
        return await UserSessionService.getAllSessions(userId);
    }

    async logout(sessionId) {
        await UserSessionService.deleteSession(sessionId);
        return "logout";
    }

    async logAllOut(userId) {
        const user = await this.#getUser(userId);
        await UserSessionService.deleteAll(user);

        return "logAllOut";
    }

    async #getUser(userId) {
        const user = await UserRepo.findById(userId);

        if (!user) {
            throw new CustomError(HttpStatusCode.BadRequest, "No user found");
        }

        return user;
    }
}

export default new UserService();
