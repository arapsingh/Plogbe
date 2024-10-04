/* eslint-disable @typescript-eslint/no-var-requires */
const  {apiConfig} = require('../apiConfig');
const login = async (values) => {
    const path = 'user/login';
    const data = {
        email: values.email,
        password: values.password,
    };
    const reponse = await apiConfig.apiCaller('POST', path, data);
    return reponse;
};
const refreshAccessToken = async () => {
    const path = 'user/refresh';
    const response = await apiConfig.apiCaller('GET', path);
    return response;
};
const registerUser = async (values) => {
    const path = 'user/signup';
    const data = {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
        confirm_password: values.confirm_password,
    };
    const response = await apiConfig.apiCaller('POST', path, data);
    return response;
};
const forgotPassword = async (values) => {
    const path = 'user/forgot-password';
    const data = {
        email: values.email,
    };
    const response = await apiConfig.apiCaller('POST', path, data);
    return response;
};
const resetPassword = async (values) => {
    const path = 'user/reset-password';
    const data = {
        new_password: values.new_password,
        confirm_password: values.confirm_password,
        token: values.token,
    };
    const response = await apiConfig.apiCaller('PATCH', path, data);
    return response;
};
const changePassword = async (values) => {
    const path = 'user/password';
    const data = {
        current_password: values.current_password,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
    };
    const response = await apiConfig.apiCaller('PATCH', path, data);
    return response;
};
const verifyEmail = async (token) => {
    const path = `user/verify/${token}`;

    const response = await apiConfig.apiCaller('GET', path);
    return response;
};
const resendForgotPasswordEmail = async (email) => {
    const path = `user/mail/forgot`;
    const data = {
        email,
    };
    const response = await apiConfig.apiCaller('POST', path, data);
    return response;
};
const resendVerifyEmail = async (email) => {
    const path = `user/mail/verify`;
    const data = {
        email,
    };
    const response = await apiConfig.apiCaller('POST', path, data);
    return response;
};
const getProfile = async () => {
    const path = `user/profile`;

    const response = await apiConfig.apiCaller('GET', path);
    return response;
};
const updateProfile = async (values) => {
    const path = `user/update-profile`;
    const data = {
        first_name: values.first_name,
        last_name: values.last_name,
        description: values.description,
    };
    const response = await apiConfig.apiCaller('PATCH', path, data);
    return response;
};

const changeAvatar = async (formData) => {
    const path = `user/avatar`;
    // Tạo một FormData và thêm file vào đó
    try {
        const response = await apiConfig.apiCaller('POST', path, formData);
        return response;
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error:', error);
    }
};
const getMe = async () => {
    const path = 'user/me';
    const response = await apiConfig.apiCaller('GET', path);
    return response;
};
const getAllUsersWithPagination = async (values) => {
    const path = `user/admin/all?search_item=${values.searchItem}&page_index=${values.pageIndex}&role=${values.role}`;
    const reponse = await apiConfig.apiCaller("GET", path);
    return reponse;
};
const deleteUser = async (values) => {
    const path = `user/admin/${values}`;
    const reponse = await apiConfig.apiCaller("DELETE", path);
    return reponse;
};

const activeUser = async (values) => {
    const path = `user/admin/${values}`;
    const reponse = await apiConfig.apiCaller("PUT", path);
    return reponse;
};
const getUserById = async (values) => {
    const path = `user/admin/${values}`;
    const reponse = await apiConfig.apiCaller("GET", path);
    return reponse;
};
const createNewUser = async (values) => {
    const path = `user/admin/`;
    const reponse = await apiConfig.apiCaller("POST", path, values);
    return reponse;
};
const editUser = async (values) => {
    const path = `user/admin/${values.id}`;
    const data = {
        first_name: values.first_name,
        last_name: values.last_name,
        is_admin: values.is_admin,
        email: values.email,
    };
    const reponse = await apiConfig.apiCaller("PATCH", path, data);
    return reponse;
};
const userApis = {
    login,
    refreshAccessToken,
    registerUser,
    forgotPassword,
    resetPassword,
    // changePassword,
    verifyEmail,
    resendForgotPasswordEmail,
    resendVerifyEmail,
    getProfile,
    updateProfile,
    changeAvatar,
    getMe,
    createNewUser,
    editUser,
    deleteUser,
    activeUser,
    getAllUsersWithPagination,
    getUserById,
};

module.exports = userApis;
