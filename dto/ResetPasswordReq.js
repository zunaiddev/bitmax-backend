import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import Cleaner from "../utils/Cleaner.js";

class ResetPasswordReq {
    constructor(body) {
        const details = {};

        this.email = Cleaner.cleanEmail(body.email);
        this.otp = Cleaner.cleanOtp(body.otp);
        this.password = body.password;

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.email)) {
            details.email = "Enter a valid email";
        }

        if (!this.otp) {
            details.otp = "OTP is required";
        }

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^\w\s]).{8,}$/;

        if (typeof this.password !== "string" || !passwordRegex.test(this.password)) {
            details.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
        }

        if (Object.keys(details).length > 0) {
            throw new CustomError(HttpStatusCode.BadRequest, "Validation failed", details);
        }
    }
}

export default ResetPasswordReq;
