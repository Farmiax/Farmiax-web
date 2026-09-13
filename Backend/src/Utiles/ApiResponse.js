class Apiresponse {
    constructor(statusCode, data, message = "success") {
        this.statusCode = statusCode;
        this.success = statusCode < 400;

        if (statusCode >= 400 && message === "success") {
            if (typeof data === "string") {
                this.message = data;
                this.data = null;
            } else {
                this.message = "An error occurred";
                this.data = data;
            }
        } else {
            this.data = data;
            this.message = message;
        }
    }
}
export { Apiresponse };