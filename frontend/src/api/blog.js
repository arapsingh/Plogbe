const { apiConfig } = require('../apiConfig');
const createBlog = async (values) => {
    const path = 'blog/';

    const reponse = await apiConfig.apiCaller('POST', path, values);
    return reponse;
};
const updateBlog = async (values) => {
    const path = 'blog/';

    const reponse = await apiConfig.apiCaller('PATCH', path, values);
    return reponse;
};
const changeStatusBlog = async (values) => {
    const path = `blog/${values}`;

    const reponse = await apiConfig.apiCaller('PATCH', path);
    return reponse;
};
const deleteBlog = async (values) => {
    const path = `blog/${values}`;

    const reponse = await apiConfig.apiCaller('DELETE', path);
    return reponse;
};
const getBlogBySlug = async (values) => {
    const path = `blog/${values}`;

    const reponse = await apiConfig.apiCaller('GET', path);
    return reponse;
};
const getAllMyBlogs = async (values) => {
    let categoryParams = '';
    values.category?.forEach((temp) => {
        categoryParams += `&category=${temp}`;
    });
    const path = `blog/my-all?search_item=${values.searchItem}&page_index=${values.pageIndex}${categoryParams}`;

    const reponse = await apiConfig.apiCaller('GET', path);
    return reponse;
};
const uploadPhotosInBlog = async (values) => {
    const path = `blog/photo_in_blog`;
    const response = await apiConfig.apiCaller('POST', path, values);
    return response;
};
const uploadPhotosInComment = async (values) => {
    const path = `blog/photo_in_comment`;
    const response = await apiConfig.apiCaller('POST', path, values);
    return response;
};
const getNewestBlogWithPagination = async (values) => {
    const path = `blog/newest?page_index=${values}`;

    const reponse = await apiConfig.apiCaller('GET', path);
    return reponse;
};
const top10Like = async () => {
    const path = `blog/top10like`;
    const reponse = await apiConfig.apiCaller('GET', path);
    return reponse;
};
const top10View = async () => {
    const path = `blog/top10view`;
    const reponse = await apiConfig.apiCaller('GET', path);
    return reponse;
};
const top5RelatedBySlug = async (values) => {
    const path = `blog/related/${values}`;
    const reponse = await apiConfig.apiCaller('GET', path);
    return reponse;
};
const increaseViewBlog = async (values) => {
    const path = `blog/view/${values}`;
    const reponse = await apiConfig.apiCaller('POST', path);
    return reponse;
};
const getAllPagingBlog = async (values) => {
    let categoryParams = '';
    values.category?.forEach((temp) => {
        categoryParams += `&category=${temp}`;
    });
    const path = `blog/search?search_item=${values.searchItem}&page_index=${values.pageIndex}${categoryParams}`;

    const reponse = await apiConfig.apiCaller('GET', path);
    return reponse;
};
const handleReactionBlog = async (values) => {
    const path = 'blog/reaction';
    const data = {
        blog_id: values.blog_id,
        type: values.type,
    };
    const reponse = await apiConfig.apiCaller('POST', path, data);
    return reponse;
};
const createCommentBlog = async (values) => {
    const path = 'blog/comment/';

    const reponse = await apiConfig.apiCaller('POST', path, values);
    return reponse;
};
const updateCommentBlog = async (values) => {
    const path = 'blog/comment/';

    const reponse = await apiConfig.apiCaller('PATCH', path, values);
    return reponse;
};
const deleteCommentBlog = async (values) => {
    const path = `blog/comment/${values}`;

    const reponse = await apiConfig.apiCaller('DELETE', path);
    return reponse;
};
const getCommentBlogById = async (values) => {
    const path = `blog/comment/${values}`;

    const reponse = await apiConfig.apiCaller('GET', path);
    return reponse;
};
const handleReactionCommentBlog = async (values) => {
    const path = 'blog/comment/reaction';
    const data = {
        comment_id: values.comment_id,
        type: values.type,
    };
    const reponse = await apiConfig.apiCaller('POST', path, data);
    return reponse;
};
const blogApis = {
    // getBlogs,
    createBlog,
    // getBlogsWithPagination,
    deleteBlog,
    // getBlog,
    updateBlog,
    changeStatusBlog,
    getAllMyBlogs,
    getBlogBySlug,
    uploadPhotosInBlog,
    // togglePublishedBlog,
    // searchBlogUserWithPagination,
    top10Like,
    top10View,
    getNewestBlogWithPagination,
    top5RelatedBySlug,
    handleReactionBlog,
    increaseViewBlog,
    getAllPagingBlog,
    uploadPhotosInComment,
    createCommentBlog,
    updateCommentBlog,
    deleteCommentBlog,
    getCommentBlogById,
    handleReactionCommentBlog,
};

module.exports = blogApis;
