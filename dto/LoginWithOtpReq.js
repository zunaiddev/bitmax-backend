import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import Cleaner from "../utils/Cleaner.js";

class LoginWithOtpReq {
    constructor(body) {
        const details = {};

        this.email = Cleaner.cleanEmail(body.email);
        this.otp = Cleaner.cleanOtp(body.otp);

        if (!this.email) {
            details.email = "Email is required";
        }

        if (!this.otp) {
            details.otp = "Otp is required";
        }

        if (Object.keys(details).length > 0) {
            throw new CustomError(HttpStatusCode.BadRequest, "Validation failed", "VALIDATION_FAILED", details);
        }
    }
}

export default LoginWithOtpReq;
