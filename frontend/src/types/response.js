class Response {
    constructor(status_code, message, success, data = null) { // Thêm data với giá trị mặc định là null
        this.status_code = status_code;
        this.message = message;
        this.success = success;
        this.data = data; // Khởi tạo thuộc tính data
    }

    getStatusCode() {
        return this.status_code;
    }

    getData() {
        return this.data; // Hàm lấy data
    }
}
module.exports = {
    Response,
};
