class CustomError extends Error {
    constructor(statusCode, message, code = "NO_CODE", details = {}) {
        super(message);

        this.name = "CustomError";
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;

        Error.captureStackTrace?.(this, CustomError);
    }
}

export default CustomError;
