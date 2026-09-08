import UserRepo from "../repository/UserRepo.js";
import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import UserSessionService from "./UserSessionService.js";
import transformSessions from "../utils/transformSession.js";
import UserResponse from "../dto/UserResponse.js";

class UserService {
    async getUser(userId) {
        return new UserResponse(await this.#getUser(userId));
    }

    async getSessions(userId) {
        return transformSessions(await UserSessionService.getAllSessions(userId));
    }

    async logout(sessionId) {
        await UserSessionService.deleteSession(sessionId);
        return {message: "logout"};
    }

    async logAllOut(userId) {
        const user = await this.#getUser(userId);
        await UserSessionService.deleteAll(user);

        return {message: "logAllOut"};
    }

    async #getUser(userId) {
        const user = await UserRepo.findById(userId);

        if (!user) {
            throw new CustomError(HttpStatusCode.BadRequest, "No user found", "NO_USER_FOUND");
        }

        return user;
    }
}

export default new UserService();