const configs = require('../configs');
const { ResponseError, ResponseSuccess } = require('../common/response');
const helper = require('../helper');
async function createCategory(req) {
    try {
        const file = req.file;
        const { title, description } = req.body;
        if (file) {
            const isAdmin = await configs.db.user.findFirst({
                where: {
                    id: req.user_id,
                    is_admin: true,
                },
            });
            if (!isAdmin) {
                return new ResponseError(401, 'Không có quyền', false);
            } else {
                const fullpathConverted = helper.ConvertHelper.convertFilePath(file.path);
                const createCategory = await configs.db.category.create({
                    data: {
                        title,
                        description,
                        url_image: fullpathConverted,
                    },
                });

                if (createCategory) {
                    return new ResponseSuccess(200, 'Thành công', true);
                } else {
                    await helper.FileHelper.destroyedFileIfFailed(file.path);
                    return new ResponseError(500, 'Lỗi nội bộ', false);
                }
            }
        } else {
            return new ResponseError(500, 'Lỗi nội bộ', false);
        }
    } catch (error) {
        return new ResponseError(500, 'Lỗi nội bộ', false);
    }
}
async function updateCategory(req) {
    try {
        const { title, description, category_id } = req.body;
        const isExistCategory = await configs.db.category.findFirst({
            where: {
                id: parseInt(category_id),
            },
        });
        const user_id = req.user_id;
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        const isUniqueCategory = await configs.db.category.findFirst({
            where: {
                title: title,
                NOT: {
                    id: parseInt(category_id),
                },
            },
        });
        const file = req.file;
        if (!isAdmin) return new ResponseError(401, 'Bạn không có quyền chỉnh sửa danh mục', false);
        else {
            if (!isExistCategory) return new ResponseError(404, 'Không tìm thấy danh mục', false);
            else {
                if (isUniqueCategory) return new ResponseError(400, 'Danh mục này đã tồn tại', false);
                else {
                    if (file) {
                        const oldpathConverted = helper.ConvertHelper.deConvertFilePath(isExistCategory.url_image);
                        const fullpathConverted = helper.ConvertHelper.convertFilePath(file.path);
                        const updateCategory = await configs.db.category.update({
                            where: {
                                id: parseInt(category_id),
                            },
                            data: {
                                title: title,
                                description: description,
                                url_image: fullpathConverted,
                            },
                        });
                        if (updateCategory) {
                            await helper.FileHelper.destroyedFileIfFailed(oldpathConverted);
                            return new ResponseSuccess(200, 'Cập nhật danh mục thành công', true, updateCategory);
                        } else {
                            await helper.FileHelper.destroyedFileIfFailed(file.path);
                            return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
                        }
                    } else {
                        const updateCategory = await configs.db.category.update({
                            where: {
                                id: parseInt(category_id),
                            },
                            data: {
                                title: title,
                                description: description,
                            },
                        });
                        if (updateCategory) {
                            return new ResponseSuccess(200, 'Cập nhật danh mục thành công', true, updateCategory);
                        } else {
                            return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi nội bộ', false);
    }
}
async function deleteCategory(req) {
    try {
        const user_id = req.user_id;
        const { category_id } = req.params;
        const isAdmin = await configs.db.user.findFirst({
            where: {
                id: user_id,
                is_admin: true,
            },
        });
        const isExistCategory = await configs.db.category.findFirst({
            where: {
                id: parseInt(category_id),
            },
        });
        if (!isAdmin) return new ResponseError(401, 'Bạn không có quyền xóa danh mục này', false);
        else {
            if (!isExistCategory) return new ResponseError(404, 'Không tìm thấy danh mục cần xóa', false);
            else {
                const deleteCategory = await configs.db.category.delete({
                    where: {
                        id: parseInt(category_id),
                    },
                });
                if (deleteCategory) return new ResponseSuccess(200, 'Xóa danh mục thành công', true);
                else return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
            }
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function getAllPagingCategory(req) {
    try {
        const user_id = req.user_id;
        const isAdmin = await configs.db.user.findFirst({
            where: {
                is_admin: true,
                id: user_id,
            },
        });
        if (!isAdmin) return new ResponseError(401, 'Không có quyền xem danh mục', false);
        else {
            const { search_item: searchItem, page_index: pageIndex } = req.query;
            const pageSize = configs.general.PAGE_SIZE;
            const getListCategories = await configs.db.category.findMany({
                skip: pageSize * (Number(pageIndex) - 1),
                take: pageSize,
                where: {
                    title: {
                        contains: searchItem?.toString(),
                    },
                },
                orderBy: {
                    title: 'asc',
                },
            });
            if (!getListCategories) return new ResponseError(404, 'Không tìm thấy danh mục', false);
            const totalRecord = await configs.db.category.count({
                where: {
                    title: {
                        contains: searchItem?.toString(),
                    },
                },
            });
            const totalPage = Math.ceil(totalRecord / pageSize);
            const categories = [];
            getListCategories.map((item) => {
                const category = {
                    category_id: item.id,
                    description: item.description,
                    title: item.title,
                    url_image: item.url_image,
                };
                return categories.push(category);
            });
            const categoriesResponseData = {
                total_record: totalRecord,
                total_page: totalPage,
                data: categories,
            };
            return new ResponseSuccess(200, 'Lấy danh sách các danh mục thành công', true, categoriesResponseData);
        }
    } catch (error) {
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
const get8BlogCategories = async (req) => {
    try {
        const getListCategories = await configs.db
            .$queryRaw`select category.id, title, description, url_image, count(blog_id) as blog_count from category left join
 blogs_categories on category.id = blogs_categories.category_id group by category.id order by blog_count desc limit 8;`;
        if (!getListCategories) return new ResponseError(404, 'Không tìm thấy danh mục', false);

        const categories = [];
        getListCategories.map((item) => {
            const category = {
                category_id: item.id,
                description: item.description,
                title: item.title,
                url_image: item.url_image,
            };
            return categories.push(category);
        });

        return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, categories);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
const getCategory = async (req) => {
    try {
        const { category_id } = req.params;

        const getCategory = await configs.db.category.findFirst({
            where: {
                id: Number(category_id),
            },
        });
        if (!getCategory) return new ResponseError(404, 'Không tìm thấy danh mục', false);
        const category = {
            category_id: getCategory.id,
            description: getCategory.description,
            title: getCategory.title,
            url_image: getCategory.url_image,
        };

        return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, category);
    } catch (error) {
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
const getCategories = async (req) => {
    try {
        const getListCategories = await configs.db.category.findMany({
            orderBy: {
                title: 'asc',
            },
        });
        if (!getListCategories) return new ResponseError(404, 'Không tìm thấy danh mục', false);
        const categories = [];
        getListCategories.map((item) => {
            const category = {
                category_id: item.id,
                description: item.description,
                title: item.title,
                url_image: item.url_image,
            };
            return categories.push(category);
        });

        return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, categories);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllPagingCategory,
    get8BlogCategories,
    getCategory,
    getCategories,
};
