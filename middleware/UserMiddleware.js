import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import JwtService from "../service/JwtService.js";
import UserSessionService from "../service/UserSessionService.js";

async function userMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new CustomError(HttpStatusCode.Unauthorized, "Authorization header is required");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new CustomError(HttpStatusCode.Unauthorized, "Bearer token is required");
    }

    try {
        const payload = JwtService.verifyToken(token);

        if (payload.purpose !== "AUTH") {
            throw new CustomError(HttpStatusCode.Unauthorized, "Invalid token purpose");
        }

        const sessions = await UserSessionService.getAllSessions(payload.id);

        if (!sessions) {
            throw new CustomError(HttpStatusCode.Unauthorized, "No sessions found");
        }

        const session = sessions.filter(s => s.accessToken === token)[0];

        if (!session) {
            throw new CustomError(HttpStatusCode.Unauthorized, "No sessions found");
        }

        req.userId = payload.id;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new CustomError(HttpStatusCode.Unauthorized, "Token has expired");
        }

        if (error instanceof CustomError) {
            throw error;
        }

        throw new CustomError(HttpStatusCode.Unauthorized, "Invalid token");
    }

    next();
}

export default userMiddleware;
