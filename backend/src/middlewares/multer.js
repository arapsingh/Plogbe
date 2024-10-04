const configs = require('../configs');
const { MulterError } = require('multer');
const helper = require('../helper');
const uploadAvatar = async (req, res, next) => {
    configs.multer.uploadAvatar(req, res, (error) => {
        if (error instanceof MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        } else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
const uploadCategory = async (req, res, next) => {
    configs.multer.uploadCategory(req, res, (error) => {
        if (error instanceof MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        } else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
const uploadImageBlog = async (req, res, next) => {
    configs.multer.uploadImageBlog(req, res, (error) => {
        if (error instanceof MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        } else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
const uploadVideo = async (req, res, next) => {
    configs.multer.uploadVideo(req, res, (error) => {
        if (error instanceof MulterError) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        } else if (error) {
            console.log(error);
            res.status(400).json({ message: error.message, success: false, status_code: 400 });
            return;
        }
        next();
    });
};
const uploadPhotosInBlog = async (req, res) => {
    try {
        configs.multer.uploadPhotosInBlog(req, res, (error) => {
            if (error instanceof MulterError) {
                console.log(error);
                res.status(400).json({ message: error.message, success: false, status_code: 400 });
                return;
            } else if (error) {
                console.log(error);
                res.status(400).json({ message: error.message, success: false, status_code: 400 });
                return;
            }
            // Lấy tất cả các file từ req.files
            const files = req.files;
            if (files && files.length > 0) {
                const filePaths = files.map((file) => helper.ConvertHelper.convertFilePath(file.path));
    
                res.status(200).json({
                    message: 'Upload success',
                    success: true,
                    status_code: 200,
                    data: filePaths, // Trả về mảng các đường dẫn file
                });
                return;
            }
            if (error && error.message) {
                res.status(400).json({ message: error.message, success: false, status_code: 400 });
            } else {
                res.status(400).json({ message: 'An unknown error occurred.', success: false, status_code: 400 });
            }
            return;
        });
    }catch(e){
        console.log("e appear:", e);
        return e;
    }
    
};

const uploadPhotosInComment = async (req, res) => {
    try {
        configs.multer.uploadPhotosInComment(req, res, (error) => {
            if (error instanceof MulterError) {
                console.log(error);
                res.status(400).json({ message: error.message, success: false, status_code: 400 });
                return;
            } else if (error) {
                console.log(error);
                res.status(400).json({ message: error.message, success: false, status_code: 400 });
                return;
            }
            // Lấy tất cả các file từ req.files
            const files = req.files;
            if (files && files.length > 0) {
                const filePaths = files.map((file) => helper.ConvertHelper.convertFilePath(file.path));
    
                res.status(200).json({
                    message: 'Upload success',
                    success: true,
                    status_code: 200,
                    data: filePaths, // Trả về mảng các đường dẫn file
                });
                return;
            }
            if (error && error.message) {
                res.status(400).json({ message: error.message, success: false, status_code: 400 });
            } else {
                res.status(400).json({ message: 'An unknown error occurred.', success: false, status_code: 400 });
            }
            return;
        });
    }catch(e){
        console.log("e appear:", e);
        return e;
    }
    
};
module.exports = {
    uploadAvatar,
    uploadCategory,
    uploadImageBlog,
    uploadVideo,
    uploadPhotosInBlog,
    uploadPhotosInComment,
};
