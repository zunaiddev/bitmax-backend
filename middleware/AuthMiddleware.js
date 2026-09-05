import MissingReqBodyError from "../exception/MissingReqBodyError.js";

function authMiddleware(req, res, next) {
    if (req.method === "POST" && !req.body) {
        throw new MissingReqBodyError();
    }

    next();
}

export default authMiddleware;