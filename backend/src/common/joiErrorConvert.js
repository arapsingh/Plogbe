// const { ValidationError, ValidationErrorItem } = require('joi');
function convertJoiErrorToString(error) {
    return error.details.map((item) => item.message).join(', ');
}
module.exports = {
    convertJoiErrorToString,
};
