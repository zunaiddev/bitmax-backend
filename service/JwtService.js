import jwt from "jsonwebtoken";
import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";

class JwtService {
    #secret = process.env.JWT_SECRET;

    generateToken(id, purpose, expiresIn) {
        return jwt.sign({id, purpose}, this.#secret, {expiresIn});
    }

    verifyToken(token, purpose) {
        try {
            const payload = jwt.verify(token, this.#secret);

            if (payload.purpose !== purpose) {
                throw new CustomError(HttpStatusCode.Forbidden, "This token is not allowed here", "BAD_TOKEN");
            }

            return payload;
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new CustomError(HttpStatusCode.Forbidden, "Token expired", "JWT_EXPIRED");
            }

            if (err.name === "CustomError") {
                throw err;
            }

            throw new CustomError(HttpStatusCode.Unauthorized, "Invalid Token", "INVALID_TOKEN");
        }
    }
}

export default new JwtService();
