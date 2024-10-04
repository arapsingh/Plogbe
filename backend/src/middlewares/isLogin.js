const { TokenExpiredError, JsonWebTokenError, NotBeforeError } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const configs = require('../configs');

const isLogin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const jsonWebToken = authHeader?.split(' ')[1];

        if (!jsonWebToken) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        } else {
            const decodeJsonWebToken = jwt.verify(jsonWebToken, configs.general.JWT_SECRET_KEY);
            if (decodeJsonWebToken) {
                const isFoundUser = await configs.db.user.findUnique({
                    where: {
                        id: decodeJsonWebToken.user_id,
                    },
                });

                if (isFoundUser) {
                    req.user_id = isFoundUser.id;
                }
            }
        }
        next();
    } catch (error) {
        console.log(error);
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: error.message });
        } else if (error instanceof JsonWebTokenError) {
            return res.status(401).json({ message: error.message });
        } else if (error instanceof NotBeforeError) {
            return res.status(401).json({ message: error.message });
        }

        return res.status(500).json({ message: 'Internal Server' });
    }
};
module.exports = {
    isLogin,
};
