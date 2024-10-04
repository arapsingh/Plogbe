const services = require('../services');
const validations = require('../validations');
const { convertJoiErrorToString } = require('../common/joiErrorConvert');
async function registerUser(req, res) {
    const response = await services.userService.registerUser(req);
    return res.status(response.getStatusCode()).json(response);
}
async function login(req, res) {
    const errorValidate = validations.userValidator.loginSchema.validate(req.body).error;

    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.userService.login(req);
    return res.status(response.getStatusCode()).json(response);
}
async function verifyEmail(req, res) {
    const response = await services.userService.verifyEmail(req);
    return res.status(response.getStatusCode()).json(response);
}
async function resendVerifyEmail(req, res) {
    const response = await services.userService.resendVerifyEmail(req);
    return res.status(response.getStatusCode()).json(response);
}

async function getProfile(req, res) {
    const response = await services.userService.getProfile(req);
    return res.status(response.getStatusCode()).json(response);
}
async function updateProfile(req, res) {
    const errorValidate = validations.userValidator.updateProfileSchema.validate(req.body).error;

    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.userService.updateProfile(req);
    return res.status(response.getStatusCode()).json(response);
}
async function changeAvatar(req, res) {
    const response = await services.userService.changeAvatar(req);
    return res.status(response.getStatusCode()).json(response);
}
async function refreshAccessToken(req, res) {
    const response = await services.userService.refreshAccessToken(req);
    return res.status(response.getStatusCode()).json(response);
}
async function resendForgotPasswordEmail(req, res) {
    const response = await services.userService.resendForgotPasswordEmail(req);
    return res.status(response.getStatusCode()).json(response);
}
async function forgotPassword(req, res) {
    const errorValidate = validations.userValidator.forgotPasswordSchema.validate(req.body).error;

    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.userService.forgotPassword(req);
    return res.status(response.getStatusCode()).json(response);
}
async function resetPassword(req, res) {
    const errorValidate = validations.userValidator.resetPasswordSchema.validate(req.body).error;

    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.userService.resetPassword(req);
    return res.status(response.getStatusCode()).json(response);
}
async function getMe(req, res) {
    const response = await services.userService.getMe(req);
    return res.status(response.getStatusCode()).json(response);
}
async function createNewUser(req, res) {
    const errorValidate = validations.userValidator.createNewUserSchema.validate(req.body).error;
    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response= await services.userService.createNewUser(req);
    return res.status(response.getStatusCode()).json(response);
}
async function editUser(req, res) {
    const errorValidate = validations.userValidator.editUserSchema.validate(req.body).error;
    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.userService.editUser(req);
    return res.status(response.getStatusCode()).json(response);
}
async function deleteUser(req, res) {
    const response = await services.userService.deleteUser(req);
    return res.status(response.getStatusCode()).json(response);
}
async function activeUser(req, res) {
    const response = await services.userService.activeUser(req);
    return res.status(response.getStatusCode()).json(response);
}
async function getAllUsers(req, res) {
    const response = await services.userService.getAllUsers(req);
    return res.status(response.getStatusCode()).json(response);
}
async function getUserById(req, res) {
    const response = await services.userService.getUserById(req);
    return res.status(response.getStatusCode()).json(response);
}
module.exports = {
    registerUser,
    login,
    verifyEmail,
    resendVerifyEmail,
    getProfile,
    updateProfile,
    changeAvatar,
    refreshAccessToken,
    resendForgotPasswordEmail,
    forgotPassword,
    resetPassword,
    getMe,
    createNewUser,
    editUser,
    deleteUser,
    activeUser,
    getAllUsers,
    getUserById,
};
