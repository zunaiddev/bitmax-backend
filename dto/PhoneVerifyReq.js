import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import Cleaner from "../utils/Cleaner.js";

class PhoneVerifyReq {
    constructor(body) {
        const details = {};

        this.phone = Cleaner.cleanPhone(body.phone);
        this.otp = Cleaner.cleanOtp(body.otp);

        if (!/^\+?[0-9]{10,15}$/.test(this.phone)) {
            details.phone = "Enter a valid phone number";
        }

        if (!this.otp) {
            details.otp = "OTP is required";
        }

        if (Object.keys(details).length > 0) {
            throw new CustomError(HttpStatusCode.BadRequest, "Validation failed", details);
        }
    }
}

export default PhoneVerifyReq;
