import UserSessionRepo from "../repository/UserSessionRepo.js";

class UserSessionService {
    async newSession(user, accessToken, refreshToken, deviceIp, deviceType, deviceName) {
        return await UserSessionRepo.saveSession({
            user, accessToken, refreshToken, deviceIp, deviceType, deviceName
        });
    }

    async getAllSessions(user) {
        return await UserSessionRepo.getSessionsByUser(user);
    }

    async deleteSession(id) {
        await UserSessionRepo.deleteSessionById(id);
    }

    async deleteAll(user) {
        await UserSessionRepo.deleteAllByUser(user);
    }
}

export default new UserSessionService();