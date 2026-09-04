import MissingReqBodyError from "../exception/MissingReqBodyError.js";
import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";

class EmailVerifyReq {
    constructor(body) {
        if (!body) {
            throw new MissingReqBodyError();
        }

        const details = {};

        this.email = body.email;
        this.otp = body.otp;

        if (!this.email) {
            details.email = "Invalid email address";
        }

        if (!this.otp) {
            details.otp = "OTP is required";
        }

        if (Object.keys(details).length > 0) {
            throw new CustomError(HttpStatusCode.BadRequest, "Validation failed", details);
        }
    }
}

export default EmailVerifyReq;
