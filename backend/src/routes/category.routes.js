const { Router } = require('express');
const controllers = require('../controllers');
const categoryRouter = Router();
const { isLogin } = require('../middlewares/isLogin');
const { uploadCategory } = require('../middlewares/multer');
categoryRouter.post('/', isLogin, uploadCategory, controllers.categoryController.createCategory);
categoryRouter.patch('/', isLogin, uploadCategory, controllers.categoryController.updateCategory);
categoryRouter.delete('/:category_id', isLogin, controllers.categoryController.deleteCategory);
categoryRouter.get('/all', isLogin, controllers.categoryController.getAllPagingCategory);
categoryRouter.get('/top8blog', controllers.categoryController.get8BlogCategories); //
categoryRouter.get('/full', controllers.categoryController.getCategories); //
categoryRouter.get('/:category_id', controllers.categoryController.getCategory); //
module.exports = categoryRouter;
