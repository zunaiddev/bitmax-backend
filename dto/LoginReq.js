import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import Cleaner from "../utils/Cleaner.js";

class LoginReq {
    constructor(body) {
        const details = {};

        this.email = Cleaner.cleanEmail(body.email);
        this.password = body.password;

        if (!this.email) {
            details.email = "Email is required";
        }

        if (!this.password) {
            details.password = "Password is required";
        }

        if (Object.keys(details).length > 0) {
            throw new CustomError(HttpStatusCode.BadRequest, "Validation failed", "VALIDATION_FAILED", details);
        }
    }
}

export default LoginReq;
