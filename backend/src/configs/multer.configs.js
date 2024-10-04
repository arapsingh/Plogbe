const configs = require('../configs');
const multer = require('multer');
const path = require('path');
const general = require('./general.configs');

//image
const storageAvatar = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${general.PATH_TO_IMAGES}/avatar`); //mac thì để /, còn windows chắc phải \\
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const storageImageBlog = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${general.PATH_TO_IMAGES}/blog`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const storageCategory = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${general.PATH_TO_IMAGES}/category`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const storagePhotoInBlog = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${general.PATH_TO_IMAGES}/photo_in_blog`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const storagePhotoInComment = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${general.PATH_TO_IMAGES}/photo_in_comment`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadAvatar = multer({
    storage: storageAvatar,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/png') {
            cb(null, true);
        } else if (file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else if (file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            return cb(new Error('Invalid file type: Only .png, .jpeg or .jpg is allowed'));
        }
    },
}).single('avatar');
const uploadImageBlog = multer({
    storage: storageImageBlog,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/png') {
            cb(null, true);
        } else if (file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else if (file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            return cb(new Error('Invalid file type: Only .png, .jpeg or .jpg is allowed'));
        }
    },
}).single('image_blog');
const uploadCategory = multer({
    storage: storageCategory,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/png') {
            cb(null, true);
        } else if (file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else if (file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            return cb(new Error('Invalid file type: Only .png, .jpeg or .jpg is allowed'));
        }
    },
}).single('category_image');
//video
const storageVideo = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, general.PATH_TO_PUBLIC_FOLDER_VIDEOS);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadVideo = multer({
    storage: storageVideo,
    limits: {
        fileSize: 1024 * 1024 * 100,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'video/mp4') {
            cb(null, true);
        } else if (file.mimetype === 'video/x-matroska') {
            cb(null, true);
        } else if (file.mimetype === 'video/mov') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type: Only .mp4, .mkv or .mov is allowed'));
        }
    },
}).single('video');
const uploadPhotosInBlog = multer({
    storage: storagePhotoInBlog,
    limits: {
        fileSize: 1024 * 1024 * 4, // Giới hạn kích thước 4MB cho mỗi file
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type: Only .png, .jpeg or .jpg is allowed'));
        }
    },
}).array('photo_in_blog', 10); // Số 10 là số lượng file tối đa có thể tải lên
const uploadPhotosInComment = multer({
    storage: storagePhotoInComment,
    limits: {
        fileSize: 1024 * 1024 * 4, // Giới hạn kích thước 4MB cho mỗi file
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type: Only .png, .jpeg or .jpg is allowed'));
        }
    },
}).array('photo_in_comment', 10); // Số 10 là số lượng file tối đa có thể tải lên
module.exports = {
    uploadAvatar,
    uploadCategory,
    uploadImageBlog,
    uploadVideo,
    uploadPhotosInBlog,
    uploadPhotosInComment,
};
