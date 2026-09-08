import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import JwtService from "../service/JwtService.js";
import UserSessionService from "../service/UserSessionService.js";

async function userMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new CustomError(HttpStatusCode.Unauthorized, "Authorization header is required", "AUTH_HEADER_REQUIRED");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new CustomError(HttpStatusCode.Unauthorized, "Bearer token is required", "BEARER_TOKEN_REQUIRED");
    }

    const payload = JwtService.verifyToken(token, "AUTH");

    const sessions = await UserSessionService.getAllSessions(payload.id);

    if (!sessions) {
        throw new CustomError(HttpStatusCode.Unauthorized, "No sessions found", "NO_SESSIONS_FOUND");
    }

    const session = sessions.filter(s => s.accessToken === token)[0];

    if (!session) {
        throw new CustomError(HttpStatusCode.Unauthorized, "No sessions found", "NO_SESSIONS_FOUND");
    }

    req.userId = payload.id;

    next();
}

export default userMiddleware;