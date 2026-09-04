class CustomError extends Error {
    constructor(code, message, details) {
        super(message);
        this.code = code;
        this.message = message;
        this.details = details;
    }
}

export default CustomError;