const Joi = require('joi');
const createBlogSchema = Joi.object({
    // author_id: Joi.number().required().messages({
    //     'number.base': 'Mã tác giả phải là số nguyên dương',
    //     'any.required': 'Mã tác giả là bắt buộc',
    // }),
    title: Joi.string().required().max(200).min(10).messages({
        'string.base': 'Tiêu đề phải là chuỗi',
        'any.required': 'Tiêu đề là bắt buộc',
        'string.max': 'Tiêu đề không được vượt quá 200 kí tự',
        'string.min': 'Tiêu đề phải lớn hơn 10 kí tự',
    }),
    // content: Joi.string().required().max(200).min(1).messages({
    //     'string.base': 'Nội dung phải là chuỗi',
    //     'any.required': 'Nội dung là bắt buộc',
    //     'string.min': 'Nội dung không được để trống',
    // }),
    // slug: Joi.string().required(),
    image_blog: Joi.any(),
    categories: Joi.any(),
});
const updateBlogSchema = Joi.object({
    blog_id: Joi.number().required().messages({
        'number.base': 'Mã blog phải là số nguyên dương',
        'any.required': 'Mã blog là bắt buộc',
    }),
    title: Joi.string().required().max(200).min(10).messages({
        'string.base': 'Tiêu đề phải là chuỗi',
        'any.required': 'Tiêu đề là bắt buộc',
        'string.max': 'Tiêu đề không được vượt quá 200 kí tự',
        'string.min': 'Tiêu đề phải lớn hơn 10 kí tự',
    }),
    content: Joi.string().required().max(5000).min(1).messages({
        'string.base': 'Nội dung phải là chuỗi',
        'any.required': 'Nội dung là bắt buộc',
        'string.min': 'Nội dung không được để trống',
    }),
    // slug: Joi.string().required(),
    image_blog: Joi.any(),
    categories: Joi.any(),
    is_published: Joi.any(),
});
const handleReactionBlogSchema = Joi.object({
    blog_id: Joi.number().required().messages({
        'number.base': 'Mã blog phải là số nguyên dương',
        'any.required': 'Mã blog là bắt buộc',
    }),
    type: Joi.string().valid('LIKE', 'DISLIKE').required().messages({
        'any.only': 'Biểu cảm chỉ có thể là LIKE hoặc DISLIKE',
        'any.required': 'Biểu cảm là bắt buộc',
    }),
});
const createCommentBlogSchema = Joi.object({
    blog_id: Joi.number().required().messages({
        'number.base': 'Mã blog phải là số nguyên dương',
        'any.required': 'Mã blog là bắt buộc',
    }),
    parent_id: Joi.number().optional().messages({
        'number.base': 'Mã comment phải là số nguyên dương',
    }),
    content: Joi.string().required().max(5000).min(1).messages({
        'string.base': 'Nội dung phải là chuỗi',
        'any.required': 'Nội dung là bắt buộc',
        'string.min': 'Nội dung không được để trống',
    }),
});
const updateCommentBlogSchema = Joi.object({
    comment_id: Joi.number().required().messages({
        'number.base': 'Mã bình luận phải là số nguyên dương',
        'any.required': 'Mã bình luận là bắt buộc',
    }),
    // parent_id: Joi.number().optional().messages({
    //     'number.base': 'Mã comment cha phải là số nguyên dương',
    // }),
    content: Joi.string().required().max(5000).min(1).messages({
        'string.base': 'Nội dung phải là chuỗi',
        'any.required': 'Nội dung là bắt buộc',
        'string.min': 'Nội dung không được để trống',
    }),
});
const handleReactionCommentBlogSchema = Joi.object({
    comment_id: Joi.number().required().messages({
        'number.base': 'Mã bình luận phải là số nguyên dương',
        'any.required': 'Mã bình luận là bắt buộc',
    }),
    type: Joi.string().valid('LIKE', 'DISLIKE').required().messages({
        'any.only': 'Biểu cảm chỉ có thể là LIKE hoặc DISLIKE',
        'any.required': 'Biểu cảm là bắt buộc',
    }),
});
module.exports = {
    createBlogSchema,
    updateBlogSchema,
    handleReactionBlogSchema,
    createCommentBlogSchema,
    updateCommentBlogSchema,
    handleReactionCommentBlogSchema,
};
