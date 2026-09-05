import UserSession from "../model/UserSession.js";

class UserSessionRepo {
    async saveSession(session) {
        return await UserSession.create(session);
    }

    async getSessionsByUser(user) {
        return await UserSession.find({user});
    }

    async deleteSessionById(sessionId) {
        await UserSession.deleteOne({_id: sessionId});
    }

    async deleteAllByUser(user) {
        await UserSession.deleteMany({user});
    }
}

export default new UserSessionRepo();