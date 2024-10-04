const { db } = require('../configs/db.configs');
const { TokenExpiredError, JsonWebTokenError, NotBeforeError } = require('jsonwebtoken');
const configs = require('../configs');
const helper = require('../helper');

const isObjectEmpty = (object) => {
    for (const key in object) {
        if (key in object) {
            return false;
        }
    }
    return true;
};
const isAuthor = async (req, res, next) => {
    try {
        const file = req.file;
        const user_id = req.user_id;
        let groupId = { blog_id: '' };
        if (isObjectEmpty(req.body)) groupId = req.params;
        else if (isObjectEmpty(req.params)) groupId = req.body;
        else groupId = { ...req.params, ...req.body };
        if (groupId.blog_id) {
            const isBlogExist = await configs.db.blog.findUnique({
                where: {
                    id: Number(groupId.blog_id),
                },
            });
            if (!isBlogExist) {
                if (file) await helper.FileHelper.destroyedFileIfFailed(file.path);
                res.status(404).json({ message: 'Blog not found' });

                return;
            } else {
                if (isBlogExist.author_id !== user_id) {
                    if (file) await helper.FileHelper.destroyedFileIfFailed(file.path);
                    res.status(401).json({ message: 'Unauthorized' });

                    return;
                } else {
                    next();
                }
            }
        } else {
            if (file) await helper.FileHelper.destroyedFileIfFailed(file.path);
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
    } catch (error) {
        // if (error instanceof PrismaClientKnownRequestError) {
        //     return res.status(401).json({ message: error.toString() });
        // }
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ status_code: 401, message: error.message });
        } else if (error instanceof JsonWebTokenError) {
            return res.status(401).json({ status_code: 401, message: error.message });
        } else if (error instanceof NotBeforeError) {
            return res.status(401).json({ status_code: 401, message: error.message });
        }

        return res.status(500).json({ status_code: 500, message: 'Lỗi máy chủ nội bộ' });
    }
};
module.exports = {
    isAuthor,
};
