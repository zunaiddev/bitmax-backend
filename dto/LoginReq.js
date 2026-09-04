import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";

class LoginReq {
    constructor(body) {
        if (!body) {
            throw new CustomError(HttpStatusCode.UnprocessableContent, "Missing Req body");
        }

        const details = {};

        this.email = body.email;
        this.password = body.password;

        if (!this.email) {
            details.email = "Email is required";
        }

        if (!this.password) {
            details.password = "Password is required";
        }

        if (Object.keys(details).length > 0) {
            throw new CustomError(HttpStatusCode.BadRequest, "Validation failed", details);
        }
    }
}

export default LoginReq;
