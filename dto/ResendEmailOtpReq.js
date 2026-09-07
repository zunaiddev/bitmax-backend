import Cleaner from "../utils/Cleaner.js";
import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";

class ResendEmailOtpReq {
    constructor(body) {
        this.email = Cleaner.cleanEmail(body.email);

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.email)) {
            throw new CustomError(HttpStatusCode.UnprocessableContent, "Missing Or Invalid Email", "INVALID_EMAIL");
        }
    }
}

export default ResendEmailOtpReq;