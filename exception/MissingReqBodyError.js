import CustomError from "./CustomError.js";
import {HttpStatusCode} from "axios";

class MissingReqBodyError extends CustomError {
    constructor() {
        super(HttpStatusCode.UnprocessableContent, "Missing Req body")
    }
}

export default MissingReqBodyError;