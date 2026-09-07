import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import Cleaner from "../utils/Cleaner.js";

class EmailVerifyReq {
    constructor(body) {
        const details = {};

        this.email = Cleaner.cleanEmail(body.email);
        this.otp = Cleaner.cleanOtp(body.otp);

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.email)) {
            details.email = "Enter a valid email";
        }

        if (!this.otp) {
            details.otp = "OTP is required";
        }

        if (Object.keys(details).length > 0) {
            throw new CustomError(HttpStatusCode.BadRequest, "Validation failed", "VALIDATION_FAILED", details);
        }
    }
}

export default EmailVerifyReq;
