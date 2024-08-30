class BaseException {
    constructor(
        message,
        statusCode = 500,
        stack,
        codeMessageLanguage,
        error = undefined
    ) {
        this.message = message;
        this.stack = stack;
        this.error = error;
        this.statusCode = statusCode;
        codeMessageLanguage ?
            this.codeMessageLanguage = codeMessageLanguage
            : this.codeMessageLanguage = "truequeLibreApiErrorGeneric";
    }

    toString() {
        return this.message;
    }

    toJsonResponse() {
        return { status: "error", message: this.message };
    }
}

module.exports = BaseException;
