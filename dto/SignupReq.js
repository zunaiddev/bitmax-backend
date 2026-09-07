import CustomError from "../exception/CustomError.js";
import {HttpStatusCode} from "axios";
import Cleaner from "../utils/Cleaner.js";

class SignupReq {
    constructor(body) {
        const details = {};

        this.name = Cleaner.cleanName(body.name);
        this.email = Cleaner.cleanEmail(body.email);
        this.phone = Cleaner.cleanPhone(body.phone);
        this.password = body.password;

        if (!/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' \-]+$/.test(body.name)) {
            details.name = "Enter a valid name";
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.email)) {
            details.email = "Enter a valid email";
        }

        if (!/^\+?[0-9]{10,15}$/.test(String(this.phone ?? "").trim())) {
            details.phone = "Enter a valid phone number";
        }

        const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^\w\s]).{8,}$/;

        if (typeof this.password !== "string" || !passwordRegex.test(this.password)) {
            details.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
        }

        if (Object.keys(details).length > 0) {
            throw new CustomError(HttpStatusCode.BadRequest, "Validation failed", "VALIDATION_FAILED", details);
        }
    }
}

export default SignupReq;
