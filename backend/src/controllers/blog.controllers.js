const services = require('../services');
const validations = require('../validations');
const { convertJoiErrorToString } = require('../common/joiErrorConvert');
async function createBlog(req, res) {
    const errorValidate = validations.blogValidator.createBlogSchema.validate(req.body).error;

    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.blogService.createBlog(req);
    return res.status(response.getStatusCode()).json(response);
}
async function updateBlog(req, res) {
    const errorValidate = validations.blogValidator.updateBlogSchema.validate(req.body).error;

    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.blogService.updateBlog(req);
    return res.status(response.getStatusCode()).json(response);
}
async function changeStatusBlog(req, res) {
    const response = await services.blogService.changeStatusBlog(req);
    return res.status(response.getStatusCode()).json(response);
}
async function deleteBlog(req, res) {
    const response = await services.blogService.deleteBlog(req);
    return res.status(response.getStatusCode()).json(response);
}
async function getAllPagingBlog(req, res) {
    const response = await services.blogService.getAllPagingBlog(req);
    return res.status(response.getStatusCode()).json(response);
}
async function handleReactionBlog(req, res) {
    const errorValidate = validations.blogValidator.handleReactionBlogSchema.validate(req.body).error;

    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.blogService.handleReactionBlog(req);
    return res.status(response.getStatusCode()).json(response);
}
async function createCommentBlog(req, res) {
    const errorValidate = validations.blogValidator.createCommentBlogSchema.validate(req.body).error;

    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.blogService.createCommentBlog(req, req.io);
    return res.status(response.getStatusCode()).json(response);
}
async function updateCommentBlog(req, res) {
    const errorValidate = validations.blogValidator.updateCommentBlogSchema.validate(req.body).error;

    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.blogService.updateCommentBlog(req, req.io);
    return res.status(response.getStatusCode()).json(response);
}
async function deleteCommentBlog(req, res) {
    const response = await services.blogService.deleteCommentBlog(req, req.io);
    return res.status(response.getStatusCode()).json(response);
}
async function getCommentBlogById(req, res) {
    const response = await services.blogService.getCommentBlogById(req);
    return res.status(response.getStatusCode()).json(response);
}
async function handleReactionCommentBlog(req, res) {
    const errorValidate = validations.blogValidator.handleReactionCommentBlogSchema.validate(req.body).error;

    if (errorValidate) {
        console.log(errorValidate);
        return res.status(400).json({
            status_code: 400,
            message: convertJoiErrorToString(errorValidate),
            success: false,
        });
    }
    const response = await services.blogService.handleReactionCommentBlog(req, req.io);
    return res.status(response.getStatusCode()).json(response);
}
async function getAllMyBlogs(req, res) {
    const response = await services.blogService.getAllMyBlogs(req);
    return res.status(response.getStatusCode()).json(response);
}
async function getBlogBySlug(req, res) {
    const response = await services.blogService.getBlogBySlug(req);
    return res.status(response.getStatusCode()).json(response);
}
async function top10Like(req, res) {
    const response = await services.blogService.top10Like(req);
    return res.status(response.getStatusCode()).json(response);
}
async function top10View(req, res) {
    const response = await services.blogService.top10View(req);
    return res.status(response.getStatusCode()).json(response);
}
async function getNewestBlogWithPagination(req, res) {
    const response = await services.blogService.getNewestBlogWithPagination(req);
    return res.status(response.getStatusCode()).json(response);
}
async function top5RelatedBySlug(req, res) {
    const response = await services.blogService.top5RelatedBySlug(req);
    return res.status(response.getStatusCode()).json(response);
}
async function increaseViewBlog(req, res) {
    const response= await services.blogService.increaseViewBlog(req);
    return res.status(response.getStatusCode()).json(response);
}
module.exports = {
    createBlog,
    updateBlog,
    changeStatusBlog,
    deleteBlog,
    getAllPagingBlog,
    handleReactionBlog,
    createCommentBlog,
    updateCommentBlog,
    deleteCommentBlog,
    getCommentBlogById,
    handleReactionCommentBlog,
    getAllMyBlogs,
    getBlogBySlug,
    top10Like,
    top10View,
    getNewestBlogWithPagination,
    top5RelatedBySlug,
    increaseViewBlog,
};
