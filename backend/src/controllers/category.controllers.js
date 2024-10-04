const services = require('../services');
const validations = require('../validations');
const { convertJoiErrorToString } = require('../common/joiErrorConvert');
async function createCategory(req, res) {
    const errorValidate = validations.categoryValidator.createCategorySchema.validate(req.body).error;

    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.categoryService.createCategory(req);
    return res.status(response.getStatusCode()).json(response);
}
async function updateCategory(req, res) {
    const errorValidate = validations.categoryValidator.updateCategorySchema.validate(req.body).error;

    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.categoryService.updateCategory(req);
    return res.status(response.getStatusCode()).json(response);
}
async function deleteCategory(req, res) {
    const response = await services.categoryService.deleteCategory(req);
    return res.status(response.getStatusCode()).json(response);
}
async function getAllPagingCategory(req, res) {
    const response = await services.categoryService.getAllPagingCategory(req);
    return res.status(response.getStatusCode()).json(response);
}
async function getCategory(req, res) {
    const response = await services.categoryService.getCategory(req);
    return res.status(response.getStatusCode()).json(response);
}
async function getCategories(req, res) {
    const response = await services.categoryService.getCategories(req);
    return res.status(response.getStatusCode()).json(response);
}
async function get8BlogCategories(req, res) {
    const response = await services.categoryService.get8BlogCategories(req);
    return res.status(response.getStatusCode()).json(response);
}
module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllPagingCategory,
    getCategory,
    get8BlogCategories,
    getCategories,
};
