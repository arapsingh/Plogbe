const controllers = require('../controllers');
const { Router } = require('express');
const { isLogin } = require('../middlewares/isLogin');
const { uploadAvatar } = require('../middlewares/multer');
const userRouter = Router();
userRouter.post('/signup', controllers.userController.registerUser); //
userRouter.post('/login', controllers.userController.login); //
userRouter.post('/mail/verify', controllers.userController.resendVerifyEmail);
userRouter.get('/verify/:token', controllers.userController.verifyEmail); //
userRouter.get('/profile', isLogin, controllers.userController.getProfile);
userRouter.patch('/update-profile', isLogin, controllers.userController.updateProfile);
userRouter.post('/avatar', isLogin, uploadAvatar, controllers.userController.changeAvatar); //
userRouter.post('/mail/forgot', controllers.userController.resendForgotPasswordEmail);
userRouter.get('/refresh', controllers.userController.refreshAccessToken); //
userRouter.patch('/reset-password', controllers.userController.resetPassword); //
userRouter.post('/forgot-password', controllers.userController.forgotPassword); //
userRouter.get('/me', isLogin, controllers.userController.getMe); //
userRouter.get('/admin/all', isLogin, controllers.userController.getAllUsers);
userRouter.get('/admin/:id', isLogin, controllers.userController.getUserById);
userRouter.patch('/admin/:id', isLogin, controllers.userController.editUser);
userRouter.delete('/admin/:id', isLogin, controllers.userController.deleteUser);
userRouter.put('/admin/:id', isLogin, controllers.userController.activeUser);
userRouter.post('/admin/', isLogin, controllers.userController.createNewUser);
module.exports = userRouter;
