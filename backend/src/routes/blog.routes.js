const controllers = require('../controllers');
const Router = require('express');
const blogRouter = Router();
const { isLogin } = require('../middlewares/isLogin');
const { uploadImageBlog, uploadPhotosInBlog, uploadPhotosInComment } = require('../middlewares/multer');
blogRouter.post('/', isLogin, uploadImageBlog, controllers.blogController.createBlog);
blogRouter.patch('/', isLogin, uploadImageBlog, controllers.blogController.updateBlog);
blogRouter.patch('/comment/', isLogin, controllers.blogController.updateCommentBlog);
blogRouter.patch('/:slug', isLogin, controllers.blogController.changeStatusBlog);
blogRouter.delete('/:slug', isLogin, controllers.blogController.deleteBlog);
blogRouter.get('/search', controllers.blogController.getAllPagingBlog);
blogRouter.post('/reaction', isLogin, controllers.blogController.handleReactionBlog);
blogRouter.post('/comment/', isLogin, controllers.blogController.createCommentBlog);
blogRouter.delete('/comment/:comment_id', isLogin, controllers.blogController.deleteCommentBlog);
blogRouter.get('/comment/:comment_id', controllers.blogController.getCommentBlogById);
blogRouter.post('/comment/reaction', isLogin, controllers.blogController.handleReactionCommentBlog);
blogRouter.get('/my-all', isLogin, controllers.blogController.getAllMyBlogs);
blogRouter.post('/photo_in_blog', isLogin, uploadPhotosInBlog);
blogRouter.post('/photo_in_comment', isLogin, uploadPhotosInComment);
blogRouter.get('/newest', controllers.blogController.getNewestBlogWithPagination); //
blogRouter.get('/top10like', controllers.blogController.top10Like); //
blogRouter.get('/top10view', controllers.blogController.top10View); //
blogRouter.get('/:slug', controllers.blogController.getBlogBySlug);
blogRouter.post('/view/:slug', controllers.blogController.increaseViewBlog); //
blogRouter.get('/related/:slug', controllers.blogController.top5RelatedBySlug); //

module.exports = blogRouter;
