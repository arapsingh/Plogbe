// const { ObjectSchema } = require('joi');
const Joi = require('joi');
// type Login ={
//     email: String,
//     password: String,
// }
const loginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2 }) // Sử dụng phương thức email() để xác thực email
        .max(50)
        .trim()
        .required()
        .messages({
            'string.base': 'Email phải là chuỗi',
            'any.required': 'Email là bắt buộc',
            'string.email': 'Email sai định dạng',
            'string.max': 'Email phải dưới 50 kí tự',
        }),
    password: Joi.string().trim().required().min(8).max(20).messages({
        'string.base': 'Mật khẩu phải là chuỗi',
        'any.required': 'Mật khẩu là bắt buộc',
        'string.max': 'Mật khẩu phải dưới 20 kí tự',
        'string.min': 'Mật khẩu phải trên 8 kí tự',
    }),
});
const updateProfileSchema = Joi.object({
    first_name: Joi.string().trim().required().max(32).messages({
        'string.base': 'Họ phải là chuỗi',
        'any.required': 'Họ là bắt buộc',
        'string.max': 'Họ phải dưới 32 kí tự',
    }),
    last_name: Joi.string().trim().required().max(32).messages({
        'string.base': 'Tên phải là chuỗi',
        'any.required': 'Tên là bắt buộc',
        'string.max': 'Tên phải dưới 32 kí tự',
    }),
    description: Joi.string().trim().required().max(2000).min(8).messages({
        'string.base': 'Mô tả phải là chuỗi',
        'any.required': 'Mô tả là bắt buộc',
        'string.max': 'Mô tả phải dưới 2000 kí tự',
        'string.min': 'Mô tả phải trên 8 kí tự',
    }),
    email: Joi.string(),
});
const resetPasswordSchema = Joi.object({
    new_password: Joi.string().trim().required().min(8).max(20).messages({
        'string.base': 'Mật khẩu mới phải là chuỗi',
        'any.required': 'Mật khẩu mới là bắt buộc',
        'string.max': 'Mật khẩu mới tối đa 20 kí tự',
        'string.min': 'Mật khẩu mới tối thiểu 8 kí tự',
    }),
    confirm_password: Joi.string().trim().valid(Joi.ref('new_password')).required().messages({
        'any.only': 'Xác nhận mật khẩu mới và mật khẩu mới phải giống nhau',
        'any.required': 'Xác nhận mật khẩu là bắt buộc',
    }),
    token: Joi.string().trim().required().messages({
        'string.base': 'Mã token phải là chuỗi',
        'any.required': 'Mã token là bắt buộc',
    }),
});
const forgotPasswordSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email({ minDomainSegments: 2 }) // Sử dụng phương thức email() để xác thực email
        .required()
        .max(50)
        .messages({
            'string.base': 'Email phải là chuỗi',
            'any.required': 'Email là bắt buộc',
            'string.email': 'Định dạng email không đúng, Ví dụ: example@gmail.com',
            'string.max': 'Email tối đa 50 kí tự',
        }),
});
const createNewUserSchema = Joi.object({
    first_name: Joi.string().trim().required().max(32).messages({
        'string.base': 'Họ phải là chuỗi',
        'any.required': 'Họ là bắt buộc',
        'string.max': 'Họ phải dưới 32 kí tự',
    }),
    last_name: Joi.string().trim().required().max(32).messages({
        'string.base': 'Tên phải là chuỗi',
        'any.required': 'Tên là bắt buộc',
        'string.max': 'Tên phải dưới 32 kí tự',
    }),
    email: Joi.string()
        .trim()
        .email({ minDomainSegments: 2 }) // Sử dụng phương thức email() để xác thực email
        .required()
        .max(50)
        .messages({
            'string.base': 'Email phải là chuỗi',
            'any.required': 'Email là bắt buộc',
            'string.email': 'Định dạng email không đúng, Ví dụ: example@gmail.com',
            'string.max': 'Email tối đa 50 kí tự',
        }),
    password: Joi.string().trim().required().min(8).max(20).messages({
        'string.base': 'Mật khẩu phải là chuỗi',
        'any.required': 'Mật khẩu là bắt buộc',
        'string.max': 'Mật khẩu tối đa 20 kí tự',
        'string.min': 'Mật khẩu tối thiểu 8 kí tự',
    }),
    is_admin: Joi.boolean().required().messages({
        'any.required': 'Vai trò là bắt buộc',
        'boolean.base': 'Vai trò kiểu boolen',
    }),
});
const editUserSchema = Joi.object({
    first_name: Joi.string().trim().required().max(32).messages({
        'string.base': 'Họ phải là chuỗi',
        'any.required': 'Họ là bắt buộc',
        'string.max': 'Họ phải dưới 32 kí tự',
    }),
    last_name: Joi.string().trim().required().max(32).messages({
        'string.base': 'Tên phải là chuỗi',
        'any.required': 'Tên là bắt buộc',
        'string.max': 'Tên phải dưới 32 kí tự',
    }),
    email: Joi.string()
        .trim()
        .email({ minDomainSegments: 2 }) // Sử dụng phương thức email() để xác thực email
        .required()
        .max(50)
        .messages({
            'string.base': 'Email phải là chuỗi',
            'any.required': 'Email là bắt buộc',
            'string.email': 'Định dạng email không đúng, Ví dụ: example@gmail.com',
            'string.max': 'Email tối đa 50 kí tự',
        }),
    is_admin: Joi.boolean().required().messages({
        'any.required': 'Vai trò là bắt buộc',
        'boolean.base': 'Vai trò kiểu boolen',
    }),
});
module.exports = {
    loginSchema,
    updateProfileSchema,
    resetPasswordSchema,
    forgotPasswordSchema,
    createNewUserSchema,
    editUserSchema,
};
