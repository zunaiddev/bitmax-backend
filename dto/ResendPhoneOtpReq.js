import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import Cleaner from "../utils/Cleaner.js";

class ResendPhoneOtpReq {
    constructor(body) {
        this.phone = Cleaner.cleanPhone(body.phone);

        if (!/^\+?[0-9]{10,15}$/.test(this.phone)) {
            throw new CustomError(HttpStatusCode.BadRequest, "Enter a valid phone number", "INVALID_PHONE");
        }
    }
}

export default ResendPhoneOtpReq;
