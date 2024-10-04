import { object, string, ref } from 'yup';
import * as Yup from 'yup';

const loginValidationSchema = object({
    email: string()
        .trim()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc')
        .max(50, 'Email không được vượt quá 50 ký tự'),
    password: string()
        .trim()
        .required('Mật khẩu là bắt buộc')
        .max(20, 'Mật khẩu không được vượt quá 20 ký tự')
        .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
});

const signupValidationSchema = Yup.object().shape({
    email: Yup.string().trim().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string()
        .trim()
        .required('Mật khẩu là bắt buộc')
        .max(20, 'Mật khẩu không được vượt quá 20 ký tự')
        .min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirm_password: Yup.string().trim().required('Xác nhận mật khẩu là bắt buộc'),

    first_name: Yup.string().trim().required('Họ là bắt buộc').max(30, 'Họ không được vượt quá 30 ký tự'),
    last_name: Yup.string().trim().required('Tên là bắt buộc').max(30, 'Tên không được vượt quá 30 ký tự'),
});

const forgotPasswordValidationSchema = object({
    email: string()
        .trim()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc')
        .max(50, 'Email không được vượt quá 50 ký tự'),
});

const resetPasswordValidationSchema = object({
    new_password: string()
        .trim()
        .required('Mật khẩu mới là bắt buộc')
        .max(20, 'Mật khẩu mới không được vượt quá 20 ký tự')
        .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
    confirm_password: string().trim().required('Xác nhận mật khẩu là bắt buộc'),
});

const changePasswordValidationSchema = object({
    current_password: string()
        .trim()
        .required('Mật khẩu hiện tại là bắt buộc')
        .max(20, 'Mật khẩu hiện tại không được vượt quá 20 ký tự')
        .min(8, 'Mật khẩu hiện tại phải có ít nhất 8 ký tự'),
    new_password: string()
        .trim()
        .required('Mật khẩu mới là bắt buộc')
        .max(20, 'Mật khẩu mới không được vượt quá 20 ký tự')
        .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự'),
    confirm_password: string()
        .trim()
        .required('Xác nhận mật khẩu là bắt buộc')
        .oneOf([ref('new_password')], 'Mật khẩu xác nhận không khớp'),
});
const updateProfileValidationSchema = Yup.object({
    first_name: Yup.string().trim().max(32, 'Họ không được vượt quá 32 ki tự').required('Họ là bắt buộc'),
    last_name: Yup.string().trim().max(32, 'Tên không được vượt quá 32 kí tự').required('Tên là bắt buộc'),
    description: Yup.string()
        .trim()
        .min(8, 'Mô tả bản thân phải có ít nhất 8 kí tự')
        .required('Mô tả bản thân là bắt buộc'),
});

const editUserValidationSchema = Yup.object({
    first_name: Yup.string().trim().max(32, 'Họ tối đa 32 kí tự').required('Họ là bắt buộc'),
    last_name: Yup.string().trim().max(32, 'Tên tối đa 32 kí tự').required('ên là bắt buộc'),
    email: Yup.string().trim().email('Email không hợp lệ').required('Email là bắt buộc'),
    is_admin: Yup.boolean().required('Vai trò là bắt buộc'),
});
const createUserValidationSchema = Yup.object({
    email: Yup.string().trim().email('Email không hợp lệ').required('Email là bắt buộc'),
    password: Yup.string()
        .trim()
        .required('Mật khẩu là bắt buộc')
        .max(20, 'Mật khẩu tối đa 20 kí tự')
        .min(8, 'Mật khẩu tối thiểu 8 kí tự'),
    first_name: Yup.string().trim().required('Họ là bắt buộc').max(32, 'Họ tối đa 32 kí tự'),
    last_name: Yup.string().trim().required('Tên là bắt buộc').max(32, 'Tên tối đa 32 kí tự'),
    is_admin: Yup.boolean().required('Vai trò là bắt buộc'),
});

export {
    loginValidationSchema,
    signupValidationSchema,
    forgotPasswordValidationSchema,
    resetPasswordValidationSchema,
    changePasswordValidationSchema,
    updateProfileValidationSchema,
    createUserValidationSchema,
    editUserValidationSchema,
};
