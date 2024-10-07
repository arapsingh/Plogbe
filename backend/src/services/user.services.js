const { ResponseSuccess, ResponseError } = require('../common/response');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError, TokenExpiredError, NotBeforeError } = require('jsonwebtoken');
const configs = require('../configs');
const { setSignupEmail, setResetEmail } = require('../configs/nodemailer.configs');
const { sendMail } = require('../common/mail');
const helper = require('../helper');
const { PrismaClientKnownRequestError } = require('@prisma/client');
async function registerUser(req) {
    try {
        const { first_name, last_name, email, password, confirm_password } = req.body;
        if (password != confirm_password) return new ResponseError(400, 'Mật khẩu không khớp', false);
        const isUserExist = await configs.db.user.findUnique({
            where: {
                email: email,
            },
        });
        if (isUserExist) return new ResponseError(400, 'Email đã được sử dụng', false);
        else {
            const hashedPassword = await bcrpyt.hash(password, configs.general.HASH_SALT);
            const createUser = await configs.db.user.create({
                data: {
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                },
            });
            if (createUser) {
                const payload = {
                    email: createUser.email,
                    id: createUser.id,
                };

                const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY, {
                    expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
                });
                console.log(token);
                const link = `${configs.general.DOMAIN_NAME}/verify-email/${token}`;
                const html = setSignupEmail(link);
                const mailOptions = {
                    from: 'Plog',
                    to: `${createUser.email}`,
                    subject: 'Plog - Verification email',
                    text: 'You recieved message from Plog',
                    html: html,
                };
                const isSendEmailSuccess = await sendMail(mailOptions);
                if (isSendEmailSuccess) {
                    await configs.db.user.update({
                        where: {
                            email: createUser.email,
                        },
                        data: {
                            token: token,
                        },
                    });
                    return new ResponseSuccess(
                        200,
                        'Đăng kí thành công, vui lòng kiểm tra mail của bạn để xác thực tài khoản',
                        true
                    );
                } else {
                    return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
                }
            } else {
                return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
            }
        }
    } catch (error) {
        return new ResponseError(400, error.message, false);
    }
}
async function login(req) {
    try {
        const { email, password } = req.body;
        const findUserByEmail = await configs.db.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!findUserByEmail) return new ResponseError(404, 'Không tìm thấy người dùng', false);
        const isUserPassword = await bcrpyt.compare(password, findUserByEmail.password);
        if (!isUserPassword) return new ResponseError(400, 'Sai mật khẩu', false);
        if (!findUserByEmail.is_verify) {
            const payload = {
                email: findUserByEmail.email,
                id: findUserByEmail.id,
            };

            const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY, {
                expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const link = `${configs.general.DOMAIN_NAME}/verify-email/${token}`;
            const html = setSignupEmail(link);
            const mailOptions = {
                from: 'Plog',
                to: `${findUserByEmail.email}`,
                subject: 'Plog - Verification email',
                text: 'You recieved message from Plog',
                html: html,
            };
            const isSendEmailSuccess = sendMail(mailOptions);
            if (isSendEmailSuccess) {
                await configs.db.user.update({
                    where: {
                        email: findUserByEmail.email,
                    },
                    data: {
                        token: token,
                    },
                });
                return new ResponseSuccess(200, 'Kiếm tra email của bạn để xác minh tài khoản', true);
            } else {
                return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
            }
        } else {
            const accessToken = jwt.sign(
                {
                    user_id: findUserByEmail.id,
                    is_admin: findUserByEmail.is_admin,
                },
                configs.general.JWT_SECRET_KEY,
                {
                    expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
                }
            );
            const refreshToken = jwt.sign(
                {
                    user_id: findUserByEmail.id,
                    is_admin: findUserByEmail.is_admin,
                },
                configs.general.JWT_SECRET_KEY,
                {
                    expiresIn: configs.general.TOKEN_REFRESH_EXPIRED_TIME,
                }
            );
            return new ResponseSuccess(200, 'Đăng nhập thành công ', true, {
                accessToken,
                refreshToken,
            });
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function verifyEmail(req) {
    try {
        const { token } = req.params;
        const isVerifyToken = jwt.verify(token, configs.general.JWT_SECRET_KEY);
        const user = await configs.db.user.findUnique({
            where: {
                email: isVerifyToken.email,
            },
        });
        const validToken = user.token;
        if (token == validToken) {
            if (isVerifyToken) {
                if (user?.is_verify) {
                    return new ResponseError(400, 'Email đã được xác thực trước đó!', false);
                } else {
                    const verifyUser = await configs.db.user.update({
                        where: {
                            email: user?.email,
                        },
                        data: {
                            is_verify: true,
                            token: null,
                        },
                    });
                    if (verifyUser) return new ResponseSuccess(200, 'Xác thực email thành công', true);
                    else {
                        return new ResponseError(400, 'Xác thực email không thành công', false);
                    }
                }
            } else {
                return new ResponseError(400, 'Mã token không hợp lệ', false);
            }
        } else return new ResponseError(400, 'Mã token không hợp lệ hoặc đã hết hạn', false);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function resendVerifyEmail(req) {
    try {
        console.log('verify');
        const { email } = req.body;
        const isExistUser = await configs.db.user.findUnique({
            where: {
                email,
            },
        });
        if (!isExistUser) {
            return new ResponseError(400, 'Không tìm thấy người dùng', false);
        } else {
            const payload = {
                email: isExistUser.email,
                id: isExistUser.id,
            };
            const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY, {
                expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const link = `${configs.general.DOMAIN_NAME}/verify-email/${token}`;
            const html = setSignupEmail(link);
            const mailOptions = {
                from: 'Plog',
                to: `${isExistUser.email}`,
                subject: 'Plog - Verification email',
                text: 'You recieved message from Plog',
                html: html,
            };

            const isSendEmailSuccess = sendMail(mailOptions);
            if (isSendEmailSuccess) {
                await configs.db.user.update({
                    where: {
                        email: isExistUser.email,
                    },
                    data: {
                        token: token,
                    },
                });
                return new ResponseSuccess(200, 'Kiếm tra email của bạn để xác minh tài khoản', true);
            } else {
                return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
            }
        }
    } catch (error) {
        console.log('verify', error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function getProfile(req) {
    try {
        const user = await configs.db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true,
                is_deleted: false,
            },
            select: {
                first_name: true,
                last_name: true,
                url_avatar: true,
                description: true,
                email: true,
                is_admin: true,
            },
        });

        if (!user) return new ResponseError(404, 'Không tìm thấy người dùng', false);
        return new ResponseSuccess(200, 'Gửi yêu cầu thành công', true, user);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
        }
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}

const updateProfile = async (req) => {
    try {
        const { first_name, last_name, description } = req.body;
        const user = await configs.db.user.findFirst({
            where: {
                id: req.user_id,
                is_verify: true,
            },
        });
        if (!user) return new ResponseError(404, 'Không tìm thấy người dùng', false);
        const isUpdate = await configs.db.user.update({
            where: {
                id: req.user_id,
            },
            data: {
                first_name: first_name,
                last_name: last_name,
                description: description,
            },
        });
        if (!isUpdate) return new ResponseSuccess(200, 'Cập nhật dữ liệu thành công', false); //Missing Request body
        return new ResponseSuccess(200, 'Cập nhật dữ liệu thành công', true);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
        }
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
const changeAvatar = async (req) => {
    try {
        const file = req.file;

        const isExistUser = await configs.db.user.findFirst({
            where: {
                id: req.user_id,
            },
        });
        if (!isExistUser) return new ResponseError(404, 'Không tìm thấy người dùng', false);
        else {
            let oldAvatarPath = '';
            if (isExistUser.url_avatar) oldAvatarPath = helper.ConvertHelper.deConvertFilePath(isExistUser.url_avatar);
            if (file) {
                const fullpathConverted = helper.ConvertHelper.convertFilePath(file.path);
                const changeAvatarUser = await configs.db.user.update({
                    where: {
                        id: req.user_id,
                    },
                    data: {
                        url_avatar: fullpathConverted,
                    },
                });
                if (changeAvatarUser) {
                    await helper.FileHelper.destroyedFileIfFailed(oldAvatarPath);
                    return new ResponseSuccess(200, 'Cập nhật ảnh đại diện thành công', true);
                } else {
                    await helper.FileHelper.destroyedFileIfFailed(file.path);
                    return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
                }
            } else {
                return new ResponseError(500, 'Có lỗi xảy ra trong quá trình xử lí', false);
            }
        }
    } catch (error) {
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
async function forgotPassword(req) {
    try {
        const { email } = req.body;
        const findUserByEmail = await configs.db.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!findUserByEmail) return new ResponseError(404, 'Không tìm thấy người dùng', false);
        else {
            const payload = {
                email: findUserByEmail.email,
                id: findUserByEmail.id,
            };
            const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY, {
                expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const link = `${configs.general.DOMAIN_NAME}/reset-password/${token}`;
            const html = setResetEmail(link);
            const mailOptions = {
                from: 'Plog',
                to: `${findUserByEmail.email}`,
                subject: 'Plog - Reset Password Email',
                text: 'You received message from Plog',
                html: html,
            };
            const isSendEmailSuccess = await sendMail(mailOptions);
            if (isSendEmailSuccess) {
                const saveToken = await configs.db.user.update({
                    where: {
                        email: findUserByEmail.email,
                    },
                    data: {
                        token: token,
                    },
                });
                if (saveToken)
                    return new ResponseSuccess(200, 'Kiểm tra email của bạn để lấy liên kết đặt lại mật khẩu', true);
                else return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
            } else return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
        }
    } catch (error) {
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function resendForgotPasswordEmail(req) {
    try {
        const { email } = req.body;
        const findUserByEmail = await configs.db.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!findUserByEmail) return new ResponseError(404, 'Không tìm thấy người dùng', false);
        else {
            const payload = {
                email: findUserByEmail.email,
                id: findUserByEmail.id,
            };
            const token = jwt.sign(payload, configs.general.JWT_SECRET_KEY, {
                expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
            });
            const link = `${configs.general.DOMAIN_NAME}/reset-password/${token}`;
            const html = setResetEmail(link);
            const mailOptions = {
                from: 'Plog',
                to: `${findUserByEmail.email}`,
                subject: 'Plog - Reset Password Email',
                text: 'You received message from Plog',
                html: html,
            };
            const isSendEmailSuccess = await sendMail(mailOptions);
            if (isSendEmailSuccess) {
                const saveToken = await configs.db.user.update({
                    where: {
                        email: findUserByEmail.email,
                    },
                    data: {
                        token: token,
                    },
                });
                if (saveToken)
                    return new ResponseSuccess(200, 'Kiểm tra email của bạn để lấy liên kết đặt lại mật khẩu', true);
                else return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
            } else return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
        }
    } catch (error) {
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function resetPassword(req) {
    try {
        const { new_password, confirm_password, token } = req.body;
        const isVerifyToken = jwt.verify(token, configs.general.JWT_SECRET_KEY);
        if (!isVerifyToken) return new ResponseError(400, 'Token không hợp lệ');
        else {
            if (confirm_password != new_password)
                return new ResponseError(400, 'Mật khẩu mới và xác nhận mật khẩu mới không trùng khớp', false);
            // if (!isVerifyToken) return new ResponseError(400, 'Token không hợp lệ');
            else {
                const hashedPassword = await bcrpyt.hash(new_password, configs.general.HASH_SALT);
                if (hashedPassword) {
                    const isFoundUser = await configs.db.user.findUnique({
                        where: {
                            email: isVerifyToken.email,
                        },
                    });
                    if (!isFoundUser) return new ResponseError(404, 'Không tìm thấy người dùng', false);
                    else if (isFoundUser.token == token) {
                        const updatePassword = await configs.db.user.update({
                            where: {
                                email: isVerifyToken.email,
                            },
                            data: {
                                password: hashedPassword,
                                token: null,
                            },
                        });
                        if (updatePassword) return new ResponseSuccess(200, 'Đặt lại mật khẩu thành công', true);
                        else return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
                    } else return new ResponseError(400, 'Mã token không hợp lệ', false);
                } else {
                    return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
                }
            }
        }
    } catch (err) {
        console.log(err);
        if (err.name === 'JsonWebTokenError') {
            return new ResponseError(400, 'Token không hợp lệ', false);
        } else if (err.name === 'TokenExpiredError') {
            return new ResponseError(400, 'Token đã hết hạn', false);
        } else if (err.name === 'NotBeforeError') {
            return new ResponseError(400, 'Token chưa có hiệu lực', false);
        } else {
            return new ResponseError(400, 'Lỗi xác thực token', false);
        }
    }
}
async function refreshAccessToken(req) {
    try {
        const refreshTokenRaw = req.headers.rftoken;
        const refreshToken = refreshTokenRaw.split(' ')[1];
        if (!refreshToken) return new ResponseError(400, 'Yêu cầu không hợp lệ', false);
        const isVerifyRefreshToken = jwt.verify(refreshToken, configs.general.JWT_SECRET_KEY);
        if (isVerifyRefreshToken) {
            const newAccessToken = jwt.sign(
                {
                    user_id: isVerifyRefreshToken.user_id,
                    is_admin: isVerifyRefreshToken.is_admin,
                },
                configs.general.JWT_SECRET_KEY,
                {
                    expiresIn: configs.general.TOKEN_ACCESS_EXPIRED_TIME,
                }
            );
            return new ResponseSuccess(200, 'Làm mới token thành công', true, {
                accessToken: newAccessToken,
            });
        } else {
            return new ResponseError(400, 'Mã token không hợp lệ', false);
        }
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, 'Vui lòng đăng nhập lại', false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(400, 'Vui lòng đăng nhập lại', false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(400, 'Vui lòng đăng nhập lại', false);
        }
        return new ResponseError(400, error, false);
    }
}
const getMe = async (req) => {
    try {
        const id = req.user_id;
        const isFoundUser = await configs.db.user.findUnique({
            where: {
                id,
            },
        });
        if (isFoundUser) {
            const userInformation = {
                user_id: isFoundUser.id,
                email: isFoundUser.email,
                first_name: isFoundUser.first_name,
                last_name: isFoundUser.last_name,
                url_avatar: isFoundUser.url_avatar,
                description: isFoundUser.description,
                is_admin: isFoundUser.is_admin,
            };
            return new ResponseSuccess(200, 'Gửi yêu cầu thành công', true, userInformation);
        } else {
            return new ResponseError(404, 'Không tìm thấy người dùng', false);
        }
    } catch (error) {
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};

// User Management By Admin
const createNewUser = async (req) => {
    try {
        const { first_name, last_name, email, password, is_admin } = req.body;
        const user_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, 'Không có quyền', false);
        const hashedPassword = await bcrpyt.hash(password, configs.general.HASH_SALT);
        const createUser = await configs.db.user.create({
            data: {
                first_name,
                last_name,
                email,
                password: hashedPassword,
                is_admin,
                is_verify: true,
            },
        });
        if (createUser) return new ResponseSuccess(200, 'Tạo mới người dùng thành công', true);
        else return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
        }
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
const editUser = async (req) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, is_admin } = req.body;
        const admin_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: admin_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, 'Không có quyền', false);
        const createUser = await configs.db.user.update({
            data: {
                first_name,
                last_name,
                email,
                is_admin,
            },
            where: {
                id: Number(id),
            },
        });
        if (createUser) return new ResponseSuccess(200, 'Cập nhật người dùng thành công', true);
        else return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
        }
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
const deleteUser = async (req)=> {
    try {
        const { id } = req.params;
        const admin_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: admin_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, 'Không có quyền', false);
        const createUser = await configs.db.user.update({
            data: {
                is_deleted: true,
            },
            where: {
                id: Number(id),
            },
        });
        if (createUser) return new ResponseSuccess(200, 'Xóa người dùng thành công', true);
        else return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
        }
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
const activeUser = async (req)=> {
    try {
        const { id } = req.params;
        const admin_id = Number(req.user_id);
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: admin_id,
                is_admin: true,
            },
        });
        if (!isAdmin) return new ResponseError(400, 'Không có quyền', false);
        const createUser = await configs.db.user.update({
            data: {
                is_deleted: false,
            },
            where: {
                id: Number(id),
            },
        });
        if (createUser) return new ResponseSuccess(200, 'Cập nhật người dùng thành công', true);
        else return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
        }
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
const getAllUsers = async (req) => {
    try {
        const { page_index: pageIndex, search_item: searchItem, role } = req.query;
        const userId = req.user_id;
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: Number(userId),
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin) return new ResponseError(400, 'Không có quyền', false);
        const parsePageIndex = Number(pageIndex);
        const parsedPageIndex = isNaN(parsePageIndex) ? 1 : parsePageIndex;
        const parsedSearchItem = searchItem;
        const skip = (parsedPageIndex - 1) * 10;
        const take = 10;

        let searchUserData;
        if (role === "All") {
            searchUserData = {
                OR: [
                    {
                        first_name: {
                            contains: parsedSearchItem,
                        },
                    },
                    {
                        last_name: {
                            contains: parsedSearchItem,
                        },
                    },
                    {
                        email: {
                            contains: parsedSearchItem,
                        },
                    },
                ],
            };
        } else {
            searchUserData = {
                OR: [
                    {
                        first_name: {
                            contains: parsedSearchItem,
                        },
                    },
                    {
                        last_name: {
                            contains: parsedSearchItem,
                        },
                    },
                    {
                        email: {
                            contains: parsedSearchItem,
                        },
                    },
                ],
                is_admin: role === "Admin" ? true : false,
            };
        }

        const users = await configs.db.user.findMany({
            skip,
            take,
            orderBy: {
                created_at: "desc",
            },
            where: searchUserData,
        });
        console.log(users);
        const totalRecord = await configs.db.user.count({
            where: searchUserData,
        });

        const totalPage = Math.ceil(totalRecord / take);

        const usersData = users.map((user) => {
            return {
                user_id: user.id,
                description: user.description,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                url_avatar: user.url_avatar,
                is_admin: user.is_admin,
                is_delete: user.is_deleted,
                updated_at: user.updated_at.toString(),
            };
        });

        const responseData= {
            total_page: totalPage,
            total_record: totalRecord,
            data: usersData,
        };
        return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, responseData);
    } catch (error) {
        console.error("Lỗi xảy ra:", error);
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
        }
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
async function getUserById(req) {
    try {
        const {id} = req.params;
        const adminId = req.user_id;
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: Number(adminId),
                is_admin: true,
                is_deleted: false,
            },
        });
        if (!isAdmin) return new ResponseError(400, 'Không có quyền', false);
        const user = await configs.db.user.findFirst({
            where: {
                id: id,
                // is_verify: true,
                // is_deleted: false,
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                url_avatar: true,
                description: true,
                email: true,
                is_admin: true,
                is_deleted: true,
                updated_at: true,
            },
        });

        if (!user) return new ResponseError(404, 'Không tìm thấy người dùng', false);
        return new ResponseSuccess(200, 'Gửi yêu cầu thành công', true, user);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
        }
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
module.exports = {
    registerUser,
    login,
    verifyEmail,
    resendVerifyEmail,
    updateProfile,
    getProfile,
    changeAvatar,
    forgotPassword,
    resendForgotPasswordEmail,
    resetPassword,
    refreshAccessToken,
    getMe,
    createNewUser,
    editUser,
    deleteUser,
    activeUser,
    getAllUsers,
    getUserById,
};
