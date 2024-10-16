const Joi = require('joi');
const createCategorySchema = Joi.object({
    title: Joi.string().trim().max(50).messages({
        'string.base': 'Tiêu đề danh mục phải là chuỗi',
        'any.required': 'Tiêu đề danh mục là bắt buộc',
        'string.max': 'Tiêu đề danh mục phải dưới 50 kí tự',
    }),
    description: Joi.string().trim().required().max(800).min(8).messages({
        'string.base': 'Mô tả danh mục phải là chuỗi',
        'any.required': 'Mô tả danh mục là bắt buộc',
        'string.max': 'Mô tả danh mục phải dưới 800 kí tự',
        'string.min': 'Mô tả danh mục phải trên 8 kí tự',
    }),
});
const updateCategorySchema = Joi.object({
    title: Joi.string().trim().max(50).messages({
        'string.base': 'Tiêu đề danh mục phải là chuỗi',
        'any.required': 'Tiêu đề danh mục là bắt buộc',
        'string.max': 'Tiêu đề danh mục phải dưới 50 kí tự',
    }),
    description: Joi.string().trim().required().max(800).min(8).messages({
        'string.base': 'Mô tả danh mục phải là chuỗi',
        'any.required': 'Mô tả danh mục là bắt buộc',
        'string.max': 'Mô tả danh mục phải dưới 800 kí tự',
        'string.min': 'Mô tả danh mục phải trên 8 kí tự',
    }),
    category_id: Joi.number().required().messages({
        'number.base': 'Id phải là số dương',
        'any.required': 'Id là bắt buộc',
    }),
    category_image: Joi.any(),
});
module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
