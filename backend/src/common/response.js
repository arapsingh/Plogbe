class ResponseBase {
    constructor(status_code, message, success) {
        this.status_code = status_code;
        this.message = message;
        this.success = success;
    }

    getStatusCode() {
        return this.status_code;
    }
}

class ResponseSuccess extends ResponseBase {
    constructor(status_code, message, success, data) {
        super(status_code, message, success);
        this.data = data; // `data` sẽ undefined nếu không được cung cấp.
    }
}

class ResponseError extends ResponseBase {
    constructor(status_code, message, success) {
        super(status_code, message, success);
    }
}

// Xuất các lớp để sử dụng ở nơi khác
module.exports = {
    ResponseBase,
    ResponseSuccess,
    ResponseError,
};