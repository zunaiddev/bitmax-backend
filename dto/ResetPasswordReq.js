import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";

class ResetPasswordReq {
    constructor(body) {
        const details = {};

        this.token = body.token;
        this.password = body.password;

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^\w\s]).{8,}$/;

        if (!this.token) {
            details.token = "Token is required";
        }

        if (typeof this.password !== "string" || !passwordRegex.test(this.password)) {
            details.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
        }

        if (Object.keys(details).length > 0) {
            throw new CustomError(HttpStatusCode.BadRequest, "Validation failed", "VALIDATION_FAILED", details);
        }
    }
}

export default ResetPasswordReq;