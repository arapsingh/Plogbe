const configs = require('../configs');
const { ResponseSuccess, ResponseError } = require('../common/response');
const helper = require('../helper');
const slugify = require('slugify');
const { ReactionType } = require('@prisma/client');
const { DateTime } = require('luxon');
const fs = require('fs');

async function generateUniqueSlug(title) {
    const baseSlug = slugify(title, {
        lower: true, // Chuyển thành chữ thường
        remove: /[*+~.()'"!:@?]/g, // Loại bỏ các ký tự không mong muốn
        locale: 'vi', // Đảm bảo xử lý tiếng Việt
    });

    const uniqueString = `${Date.now()}${Math.random().toFixed(3).split('.')[1]}`;
    const slug = `${baseSlug}-${uniqueString}`;

    return slug;
}
const createBlog = async (req) => {
    try {
        const file = req.file;
        const userId = req.user_id;
        const { title } = req.body;
        const uniqueSlug = (await generateUniqueSlug(title)).toString();

        if (file) {
            // const isAdmin = await configs.db.user.findFirst({
            //     where: {
            //         id: userId,
            //         is_admin: true,
            //     },
            // });
            // if (!isAdmin) {
            //     return new ResponseError(401, 'Không có quyền', false);
            // } else {
            const fullpathConverted = helper.ConvertHelper.convertFilePath(file.path);

            const createBlog = await configs.db.blog.create({
                data: {
                    author_id: userId,
                    title: title,
                    content: '',
                    slug: uniqueSlug,
                    url_image: fullpathConverted,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });

            if (createBlog) {
                return new ResponseSuccess(200, 'Tạo blog thành công', true);
            } else {
                await helper.FileHelper.destroyedFileIfFailed(file.path);
                return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
            }
            // }
        } else {
            return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
// async function createBlog(req) {
//     try {
//         const { title, content, categories } = req.body;
//         const uniqueSlug = (await generateUniqueSlug(title)).toString();
//         const file = req.file;
//         if (!file) {
//             return new ResponseError(400, 'Không tìm thấy file ảnh', false);
//         } else {
//             const fullpathConverted = helper.ConvertHelper.convertFilePath(file.path);
//             const createBlog = await configs.db.blog.create({
//                 data: {
//                     author_id: parseInt(req.user_id),
//                     title: title,
//                     slug: uniqueSlug,
//                     url_image: fullpathConverted,
//                     content: content,
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 },
//             });
//             const isCreateCategory = await configs.db.blogCategory.createMany({
//                 data: categories.split(',').map((category) => ({
//                     blog_id: Number(createBlog.id),
//                     category_id: Number(category),
//                 })),
//             });
//             if (createBlog && isCreateCategory) return new ResponseSuccess(200, 'Thành công', true);
//             else {
//                 await helper.FileHelper.destroyedFileIfFailed(file.path);
//                 return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
//     }
// }
async function updateBlog(req) {
    try {
        const author_id = req.user_id;
        const { blog_id, title, content, categories } = req.body;
        // const convertPublished = is_published === 'true' || is_published === true;
        // const uniqueSlug = (await generateUniqueSlug(title)).toString();
        const isBlogExist = await configs.db.blog.findFirst({
            where: {
                id: parseInt(blog_id),
                author_id: parseInt(author_id),
            },
        });
        const file = req.file;
        if (isBlogExist) {
            if (!file) {
                const updateBlogWithoutThumbnail = await configs.db.blog.update({
                    where: {
                        id: parseInt(blog_id),
                    },
                    data: {
                        title: title,
                        content: content,
                        updated_at: new Date(),
                        // is_published: convertPublished,
                        // slug: uniqueSlug,
                    },
                });
                const deleteOldCategory = await configs.db.blogCategory.deleteMany({
                    where: { blog_id: Number(blog_id) },
                });
                const isUpdateCategory = await configs.db.blogCategory.createMany({
                    data: categories.split(',').map((category) => ({
                        blog_id: Number(blog_id),
                        category_id: Number(category),
                    })),
                });
                if (updateBlogWithoutThumbnail && deleteOldCategory && isUpdateCategory) {
                    const oldImageSources = await helper.FileHelper.extractImageSources(isBlogExist.content);
                    const newImageSources = await helper.FileHelper.extractImageSources(content);
                    await oldImageSources.forEach((oldSrc) => {
                        if (!newImageSources.includes(oldSrc)) {
                            const fullPath = helper.ConvertHelper.deConvertFilePath(oldSrc); // Sử dụng hàm chuyển đổi đường dẫn
                            if (fullPath && fs.existsSync(fullPath)) {
                                helper.FileHelper.destroyedFileIfFailed(fullPath); // Sử dụng hàm xóa file
                                console.log(`Deleted: ${fullPath}`);
                            }
                        }
                    });
                    return new ResponseSuccess(200, 'Cập nhật dữ liệu thành công', true);
                } else {
                    return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
                }
            } else {
                const fullpathConverted = helper.ConvertHelper.convertFilePath(file.path);
                const oldThumbnail = helper.ConvertHelper.deConvertFilePath(isBlogExist.url_image);
                const updateBlogWithThumbnail = await configs.db.blog.update({
                    where: {
                        id: parseInt(blog_id),
                    },
                    data: {
                        title: title,
                        content: content,
                        updated_at: new Date(),
                        // is_published: convertPublished,
                        url_image: fullpathConverted,
                        // slug: uniqueSlug,
                    },
                });
                const deleteOldCategory = await configs.db.blogCategory.deleteMany({
                    where: { blog_id: Number(blog_id) },
                });
                const isUpdateCategory = await configs.db.blogCategory.createMany({
                    data: categories.split(',').map((category) => ({
                        blog_id: Number(blog_id),
                        category_id: Number(category),
                    })),
                });
                if (updateBlogWithThumbnail && deleteOldCategory && isUpdateCategory) {
                    await helper.FileHelper.destroyedFileIfFailed(oldThumbnail);
                    const oldImageSources = await helper.FileHelper.extractImageSources(isBlogExist.content);
                    const newImageSources = await helper.FileHelper.extractImageSources(content);
                    await oldImageSources.forEach((oldSrc) => {
                        if (!newImageSources.includes(oldSrc)) {
                            const fullPath = helper.ConvertHelper.deConvertFilePath(oldSrc); // Sử dụng hàm chuyển đổi đường dẫn
                            if (fullPath && fs.existsSync(fullPath)) {
                                helper.FileHelper.destroyedFileIfFailed(fullPath); // Sử dụng hàm xóa file
                                console.log(`Deleted: ${fullPath}`);
                            }
                        }
                    });
                    return new ResponseSuccess(200, 'Cập nhật blog thành công', true);
                } else {
                    await helper.FileHelper.destroyedFileIfFailed(file.path);
                    return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
                }
            }
        } else {
            return new ResponseError(404, 'Không tìm thấy Blog này', false);
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function changeStatusBlog(req) {
    try {
        const { slug } = req.params;
        const author_id = req.user_id;
        const isBlogExist = await configs.db.blog.findFirst({
            where: {
                slug: slug,
                author_id: parseInt(author_id),
                is_deleted: false,
            },
        });
        if (isBlogExist) {
            const isChangeStatusBlog = await configs.db.blog.update({
                where: {
                    id: isBlogExist.id,
                },
                data: {
                    is_published: !isBlogExist.is_published,
                },
            });
            if (isChangeStatusBlog) return new ResponseSuccess(200, 'Cập nhật trạng thái thành công', 200);
            else return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
        } else return new ResponseError(404, 'Không tìm thấy blog', false);
    } catch (error) {
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function deleteBlog(req) {
    try {
        const { slug } = req.params;
        const author_id = req.user_id;
        const isBlogExist = await configs.db.blog.findFirst({
            where: {
                slug: slug,
                author_id: parseInt(author_id),
                is_deleted: false,
            },
        });
        if (isBlogExist) {
            const fullPathThumbnail = helper.ConvertHelper.deConvertFilePath(isBlogExist.url_image); // Sử dụng hàm chuyển đổi đường dẫn
            helper.FileHelper.destroyedFileIfFailed(fullPathThumbnail); // Sử dụng hàm xóa file

            const isDeleteBlog = await configs.db.blog.update({
                where: {
                    id: isBlogExist.id,
                },
                data: {
                    is_deleted: true,
                },
            });
            if (isDeleteBlog) {
                const oldImageSources = await helper.FileHelper.extractImageSources(isBlogExist.content);
                await oldImageSources.forEach((oldSrc) => {
                    const fullPath = helper.ConvertHelper.deConvertFilePath(oldSrc); // Sử dụng hàm chuyển đổi đường dẫn
                    if (fullPath && fs.existsSync(fullPath)) {
                        helper.FileHelper.destroyedFileIfFailed(fullPath); // Sử dụng hàm xóa file
                        console.log(`Deleted: ${fullPath}`);
                    }
                });
                return new ResponseSuccess(200, 'Xóa blog thành công', 200);
            } else return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
        } else return new ResponseError(404, 'Không tìm thấy blog cần xóa', false);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function getAllPagingBlog(req) {
    try {
        const { search_item: searchItem, page_index: pageIndex } = req.query;
        const category = req.query.category
            ? Array.isArray(req.query.category)
                ? req.query.category
                : [req.query.category]
            : undefined;
        const categoriesConvert = category?.map((item) => Number(item));
        const pageSize = configs.general.PAGE_SIZE;
        const categoriesFilter = categoriesConvert?.map((item) => {
            return {
                blog_categories: {
                    some: {
                        category: {
                            id: item,
                        },
                    },
                },
            };
        });
        const whereCondition = {
            is_deleted: false,
            is_published: true,
            title: {
                contains: searchItem?.toString(),
            },
        };

        // Nếu có categoriesFilter, thêm vào điều kiện `AND`
        if (categoriesFilter) {
            whereCondition.AND = categoriesFilter;
        }
        const getListBlogs = await configs.db.blog.findMany({
            skip: pageSize * (Number(pageIndex) - 1),
            take: pageSize,
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
                reaction_blogs: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
            where: whereCondition,
            orderBy: {
                updated_at: 'desc',
            },
        });
        if (!getListBlogs) return new ResponseError(404, 'Không tìm thấy blog', false);
        const totalRecord = await configs.db.blog.count({
            where: whereCondition,
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const blogs = [];
        getListBlogs.map((item) => {
            const reaction = item.reaction_blogs?.length || 0;
            const like = item.reaction_blogs?.filter((reaction) => reaction.type === ReactionType.LIKE).length || 0;
            const dislike = reaction - like;
            const blog = {
                like,
                dislike,
                view: item.view,
                blog_id: item.id,
                title: item.title,
                content: item.content,
                slug: item.slug,
                url_image: item.url_image,
                created_at: DateTime.fromISO(item.created_at.toISOString()),
                updated_at: DateTime.fromISO(item.updated_at.toISOString()),
                is_published: item.is_published,
                author: {
                    user_id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                },
                categories: item.blog_categories?.map((cc) => {
                    return {
                        id: cc.category?.id,
                        title: cc.category?.title,
                        url_image: cc.category?.url_image,
                    };
                }),
            };
            return blogs.push(blog);
        });
        const blogsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: blogs,
        };

        return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, blogsResponseData);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function handleReactionBlog(req) {
    try {
        const user_id = req.user_id;
        const { blog_id, type } = req.body;
        const isBlogExist = await configs.db.blog.findFirst({
            where: {
                id: blog_id,
                is_published: true,
                is_deleted: false,
            },
        });
        if (isBlogExist) {
            const existingReaction = await configs.db.reactionBlog.findFirst({
                where: {
                    user_id: user_id,
                    blog_id: blog_id,
                },
            });
            if (existingReaction) {
                if (existingReaction.type === type) {
                    const deleteReaction = await deleteReactionBlog(existingReaction.id);
                    if (deleteReaction) return new ResponseSuccess(200, 'Thành công', true);
                    else {
                        return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí dữ liệu', false);
                    }
                } else {
                    const deleteReaction = await deleteReactionBlog(existingReaction.id);
                    const newReaction = await createReactionBlog(user_id, blog_id, type);
                    if (deleteReaction && newReaction) return new ResponseSuccess(200, 'Thành công', true);
                    else {
                        return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí dữ liệu', false);
                    }
                }
            } else {
                const newReaction = await createReactionBlog(user_id, blog_id, type);
                if (newReaction) return new ResponseSuccess(200, 'Thành công', true);
                else {
                    return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí dữ liệu', false);
                }
            }
        } else return new ResponseError(404, 'Không tìm thấy Blog', false);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function deleteReactionBlog(reaction_id) {
    try {
        const deleteReactionBlog = await configs.db.reactionBlog.delete({
            where: { id: Number(reaction_id) },
        });
        if (deleteReactionBlog) return new ResponseSuccess(200, 'Xóa biểu cảm thành công', true);
        else return new ResponseError(400, 'Có lỗi trong quá trình xử lí dữ liệu', false);
    } catch (error) {
        console.error(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function createReactionBlog(user_id, blog_id, type) {
    try {
        const createReactionBlog = await configs.db.reactionBlog.create({
            data: {
                blog_id: blog_id,
                user_id: user_id,
                type: type,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        if (createReactionBlog) return new ResponseSuccess(200, 'Bày tỏ cảm xúc thành công', true);
        else return new ResponseError(500, 'Lỗi máy chủ nội bộ');
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function getCommentBlogById(req) {
    try {
        const { comment_id } = req.params;
        const comment = await configs.db.commentBlog.findFirst({
            where: {
                id: Number(comment_id),
            },
            include: {
                user: true,
                reactions: {
                    include: {
                        user: true,
                    },
                },
                replies: {
                    include: {
                        user: true,
                        reactions: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
        });
        const reactions = comment.reactions || [];
        const like = reactions.filter((reaction) => reaction.type === ReactionType.LIKE).length;
        const dislike = reactions.filter((reaction) => reaction.type === ReactionType.DISLIKE).length;

        // Xử lý replies
        const replies = comment.replies.map((reply) => {
            const replyReactions = reply.reactions || [];
            const replyLike = replyReactions.filter((reaction) => reaction.type === ReactionType.LIKE).length;
            const replyDislike = replyReactions.filter((reaction) => reaction.type === ReactionType.DISLIKE).length;

            return {
                reply_id: reply.id,
                content: reply.content,
                like: replyLike,
                dislike: replyDislike,
                user_id: reply.user.id,
                user_first_name: reply.user.first_name,
                user_last_name: reply.user.last_name,
                user_url_avatar: reply.user.url_avatar,
                updated_at: reply.updated_at,
                reactions: reply.reactions.map((reaction) => ({
                    id: reaction.id,
                    type: reaction.type,
                    user: {
                        user_id: reaction.user.user_id,
                        first_name: reaction.user.first_name,
                        last_name: reaction.user.last_name,
                        url_avatar: reaction.user.url_avatar,
                    },
                })),
            };
        });
        if (comment.parent_id == null) {
            // Khởi tạo biến data
            const data = {
                comment_id: comment.id,
                content: comment.content,
                like,
                dislike,
                user_id: comment.user.id,
                user_first_name: comment.user.first_name,
                user_last_name: comment.user.last_name,
                user_url_avatar: comment.user.url_avatar,
                updated_at: comment.updated_at,
                reactions: comment.reactions.map((reaction) => ({
                    id: reaction.id,
                    type: reaction.type,
                    user: {
                        user_id: reaction.user.user_id,
                        first_name: reaction.user.first_name,
                        last_name: reaction.user.last_name,
                        url_avatar: reaction.user.url_avatar,
                    },
                })),
                replies,
            };
            if (!comment) return new ResponseError(404, 'Không tìm thấy bình luận hoặc phản hồi');
            else return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, data);
        } else {
            const data = {
                comment_id: comment.parent_id,
                reply_id: comment.id,
                content: comment.content,
                like,
                dislike,
                user_id: comment.user.id,
                user_first_name: comment.user.first_name,
                user_last_name: comment.user.last_name,
                user_url_avatar: comment.user.url_avatar,
                updated_at: comment.updated_at,
                reactions: comment.reactions.map((reaction) => ({
                    id: reaction.id,
                    type: reaction.type,
                    user: {
                        user_id: reaction.user.user_id,
                        first_name: reaction.user.first_name,
                        last_name: reaction.user.last_name,
                        url_avatar: reaction.user.url_avatar,
                    },
                })),
            };
            if (!comment) return new ResponseError(404, 'Không tìm thấy bình luận hoặc phản hồi');
            else return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, data);
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function createCommentBlog(req, io) {
    try {
        const user_id = req.user_id;
        const { blog_id, parent_id, content } = req.body;
        const isBlogExist = await configs.db.blog.findFirst({
            where: {
                id: Number(blog_id),
            },
        });
        if (parent_id == null) {
            if (!isBlogExist) return new ResponseError(404, 'Không tìm thấy blog', false);
            else {
                const createComment = await configs.db.commentBlog.create({
                    data: {
                        content: content,
                        blog_id: blog_id,
                        user_id: user_id,
                        created_at: new Date(),
                        updated_at: new Date(),
                    },
                });
                if (createComment) {
                    // Phát sự kiện qua socket để client nhận bình luận mới
                    const comment_id = createComment.id; // Lấy ID bình luận vừa tạo
                    const req = { params: { comment_id } }; // Tạo req với params chứa comment_id
                    const newComment = await getCommentBlogById(req);
                    io.emit('new-comment', newComment.data);
                    // console.log("ncc:", newComment.data);
                    return new ResponseSuccess(200, 'Gửi bình luận thành công', true, newComment.data);
                } else {
                    return new ResponseError(400, 'Có lỗi trong quá trình gửi dữ liệu', false);
                }
            }
        } else {
            const checkCommentExistBefore = await configs.db.commentBlog.findFirst({
                where: {
                    id: parent_id,
                    parent_id: null,
                },
            });
            if (checkCommentExistBefore) {
                if (!isBlogExist) return new ResponseError(404, 'Không tìm thấy blog', false);
                else {
                    const createComment = await configs.db.commentBlog.create({
                        data: {
                            content: content,
                            blog_id: blog_id,
                            user_id: user_id,
                            created_at: new Date(),
                            updated_at: new Date(),
                            parent_id: parent_id,
                        },
                    });
                    if (createComment) {
                        const comment_id = createComment.id; // Lấy ID bình luận vừa tạo
                        const req = { params: { comment_id } }; // Tạo req với params chứa comment_id
                        const newReply = await getCommentBlogById(req);
                        io.emit('new-reply', newReply.data);
                        return new ResponseSuccess(200, 'Gửi bình luận thành công', true, newReply.data);
                    } else {
                        return new ResponseError(400, 'Có lỗi trong quá trình gửi dữ liệu', false);
                    }
                }
            } else return new ResponseError(404, 'Chưa có bình luận này nên không thể phản hồi', false);
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
// async function updateCommentBlog(req) {
//     try {
//         const user_id = req.user_id;
//         const { content, parent_id, comment_id } = req.body;
//         const isExistComment = await configs.db.commentBlog.findFirst({
//             where: {
//                 id: Number(comment_id),
//                 user_id: user_id,
//             },
//         });
//         if (!isExistComment) return new ResponseError(404, 'Không tìm thấy bình luận của bạn', false);
//         else {
//             if (isExistComment.parent_id == null) {
//                 if (parent_id != null)
//                     return new ResponseError(400, 'Bạn không thể sửa bình luận chính thành bình luận con', false);
//                 else {
//                     const isUpdateComment = await configs.db.commentBlog.update({
//                         where: {
//                             id: comment_id,
//                         },
//                         data: {
//                             content: content,
//                             updated_at: new Date(),
//                         },
//                     });
//                     if (isUpdateComment) return new ResponseSuccess(200, 'Chỉnh sửa bình luận thành công', true);
//                     else return new ResponseError(400, 'Có lỗi trong quá trình gửi yêu cầu xử lí dữ liệu', false);
//                 }
//             } else {
//                 if (parent_id == null)
//                     return new ResponseError(400, 'Bạn không thể sửa bình luận con thành bình luận chính', false);
//                 else if (parent_id && isExistComment.parent_id != parent_id) {
//                     return new ResponseError(400, 'Không tìm thấy phản hồi cần chỉnh sửa', false);
//                 } else {
//                     const isUpdateReply = await configs.db.commentBlog.update({
//                         where: {
//                             id: comment_id,
//                             parent_id: parent_id,
//                         },
//                         data: {
//                             content: content,
//                             updated_at: new Date(),
//                         },
//                     });
//                     if (isUpdateReply) return new ResponseSuccess(200, 'Chỉnh sửa phản hồi bình luận thành công', true);
//                     else return new ResponseError(400, 'Có lỗi trong quá trình gửi yêu cầu xử lí dữ liệu', false);
//                 }
//             }
//         }
//     } catch (error) {
//         console.log(error);
//         return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
//     }
// }
async function updateCommentBlog(req, io) {
    try {
        const user_id = req.user_id;
        const { content, comment_id } = req.body;
        const isExistComment = await configs.db.commentBlog.findFirst({
            where: {
                id: Number(comment_id),
                user_id: user_id,
            },
        });
        if (!isExistComment) return new ResponseError(404, 'Không tìm thấy bình luận của bạn', false);
        else {
            const isUpdateComment = await configs.db.commentBlog.update({
                where: {
                    id: comment_id,
                },
                data: {
                    content: content,
                    updated_at: new Date(),
                },
            });
            if (isUpdateComment) {
                const oldImageSources = await helper.FileHelper.extractImageSources(isExistComment.content);
                const newImageSources = await helper.FileHelper.extractImageSources(content);
                await oldImageSources.forEach((oldSrc) => {
                    if (!newImageSources.includes(oldSrc)) {
                        const fullPath = helper.ConvertHelper.deConvertFilePath(oldSrc); // Sử dụng hàm chuyển đổi đường dẫn
                        if (fullPath && fs.existsSync(fullPath)) {
                            helper.FileHelper.destroyedFileIfFailed(fullPath); // Sử dụng hàm xóa file
                            console.log(`Deleted: ${fullPath}`);
                        }
                    }
                });
                const comment_id = isUpdateComment.id; // Lấy ID bình luận vừa tạo
                const req = { params: { comment_id } }; // Tạo req với params chứa comment_id
                const updateComment = await getCommentBlogById(req);
                if (isUpdateComment.parent_id != null) {
                    io.emit('update-reply', updateComment.data);
                } else io.emit('update-comment', updateComment.data);
                return new ResponseSuccess(200, 'Chỉnh sửa bình luận thành công', true, updateComment.data);
            } else return new ResponseError(400, 'Có lỗi trong quá trình gửi yêu cầu xử lí dữ liệu', false);
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function deleteCommentBlog(req, io) {
    try {
        const user_id = req.user_id;
        const { comment_id } = req.params;

        const isExistComment = await configs.db.commentBlog.findFirst({
            where: {
                id: Number(comment_id),
                user_id: user_id,
            },
        });
        if (isExistComment) {
            const deleteComment = await configs.db.commentBlog.delete({
                where: {
                    id: isExistComment.id,
                },
            });
            if (deleteComment) {
                const oldImageSources = helper.FileHelper.extractImageSources(isExistComment.content);
                oldImageSources.forEach((oldSrc) => {
                    const fullPath = helper.ConvertHelper.deConvertFilePath(oldSrc); // Sử dụng hàm chuyển đổi đường dẫn
                    if (fullPath && fs.existsSync(fullPath)) {
                        helper.FileHelper.destroyedFileIfFailed(fullPath); // Sử dụng hàm xóa file
                        console.log(`Deleted: ${fullPath}`);
                    }
                });
                // const comment_id = deleteComment.id; // Lấy ID bình luận vừa tạo
                // const req = { params: { comment_id } }; // Tạo req với params chứa comment_id
                // const deleteComment = await getCommentBlogById(req);
                if (deleteComment.parent_id == null) io.emit('delete-comment', deleteComment.id);
                else io.emit('delete-reply', { comment_id: deleteComment.parent_id, reply_id: deleteComment.id });

                return new ResponseSuccess(200, 'Xóa bình luận thành công', true, {
                    // Kiểm tra điều kiện và trả về giá trị phù hợp
                    [deleteComment.parent_id === null ? 'comment_id' : 'reply_id']: deleteComment.id,
                    // Nếu parent_id không phải là null, thêm comment_id vào dữ liệu trả về
                    ...(deleteComment.parent_id !== null && { comment_id: deleteComment.parent_id }),
                });
            } else return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí', false);
        } else return new ResponseError(404, 'Không tìm thấy bình luận', false);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function handleReactionCommentBlog(req, io) {
    try {
        const user_id = req.user_id;
        const { comment_id, type } = req.body;
        const isCommentExist = await configs.db.commentBlog.findFirst({
            where: {
                id: comment_id,
            },
            include: {
                reactions: true,
                // replies: {
                //     include: {
                //         reactions: true,
                //     },
                // },
            },
        });
        if (isCommentExist) {
            const existingReaction = await configs.db.reactionCommentBlog.findFirst({
                where: {
                    user_id: user_id,
                    comment_id: comment_id,
                },
            });
            let likeCount = 0;
            let dislikeCount = 0;

            // Duyệt qua mảng reactions để tính số lượng like và dislike
            isCommentExist.reactions.forEach((reaction) => {
                if (reaction.type === 'LIKE') {
                    likeCount++;
                } else if (reaction.type === 'DISLIKE') {
                    dislikeCount++;
                }
            });
            if (existingReaction) {
                if (existingReaction.type === type) {
                    const deleteReaction = await deleteReactionCommentBlog(existingReaction.id);
                    if (deleteReaction) {
                        if (type === 'LIKE') {
                            likeCount--;
                        } else {
                            dislikeCount--;
                        }
                        const data = {
                            type_req: 'DELETE',
                            ...deleteReaction.data,
                            like: likeCount,
                            dislike: dislikeCount,
                        };
                        if (isCommentExist.parent_id !== null) {
                            data.parent_id = isCommentExist.parent_id;
                        }
                        io.emit('delete-reaction-comment', data);
                        return new ResponseSuccess(200, 'Thành công', true, data);
                    } else {
                        return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí dữ liệu', false);
                    }
                } else {
                    const deleteReaction = await deleteReactionCommentBlog(existingReaction.id);
                    const newReaction = await createReactionCommentBlog(user_id, comment_id, type);
                    if (deleteReaction && newReaction) {
                        if (type === 'LIKE') {
                            likeCount++; // Tăng số lượng like
                            dislikeCount--; // Giữ nguyên số lượng dislike
                        } else if (type === 'DISLIKE') {
                            likeCount--; // Giữ nguyên số lượng like
                            dislikeCount++; // Tăng số lượng dislike
                        }
                        const data = {
                            type_req: 'UPDATE',
                            ...newReaction.data,
                            like: likeCount,
                            dislike: dislikeCount,
                        };
                        if (isCommentExist.parent_id !== null) {
                            data.parent_id = isCommentExist.parent_id; // Thêm thuộc tính parent_id nếu khác null
                        }
                        io.emit('update-reaction-comment', data);
                        return new ResponseSuccess(200, 'Thành công', true, data);
                    } else {
                        return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí dữ liệu', false);
                    }
                }
            } else {
                const newReaction = await createReactionCommentBlog(user_id, comment_id, type);
                if (newReaction) {
                    type === 'LIKE' ? likeCount++ : dislikeCount++;
                    const data = {
                        type_req: 'CREATE',
                        ...newReaction.data,
                        like: likeCount,
                        dislike: dislikeCount,
                    };
                    if (isCommentExist.parent_id !== null) {
                        data.parent_id = isCommentExist.parent_id; // Thêm thuộc tính parent_id nếu khác null
                    }
                    io.emit('create-reaction-comment', data);
                    return new ResponseSuccess(200, 'Thành công', true, data);
                } else {
                    return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí dữ liệu', false);
                }
            }
        } else return new ResponseError(404, 'Không tìm thấy bình luận', false);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function deleteReactionCommentBlog(reaction_id) {
    try {
        const deleteReactionCommentBlog = await configs.db.reactionCommentBlog.delete({
            where: { id: Number(reaction_id) },
            include: { user: true },
        });
        if (deleteReactionCommentBlog)
            return new ResponseSuccess(200, 'Xóa biểu cảm thành công', true, {
                comment_id: deleteReactionCommentBlog.comment_id,
                type: deleteReactionCommentBlog.type,
                user: {
                    user_id: deleteReactionCommentBlog.user.id,
                    first_name: deleteReactionCommentBlog.user.first_name,
                    last_name: deleteReactionCommentBlog.user.last_name,
                    url_avatar: deleteReactionCommentBlog.user.url_avatar,
                },
            });
        else return new ResponseError(400, 'Có lỗi trong quá trình xử lí dữ liệu', false);
    } catch (error) {
        console.error(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function createReactionCommentBlog(user_id, comment_id, type) {
    try {
        const createReactionCommentBlog = await configs.db.reactionCommentBlog.create({
            data: {
                comment_id: comment_id,
                user_id: user_id,
                type: type,
                created_at: new Date(),
                updated_at: new Date(),
            },
            include: {
                user: true,
            },
        });
        if (createReactionCommentBlog)
            return new ResponseSuccess(200, 'Bày tỏ cảm xúc thành công', true, {
                comment_id: createReactionCommentBlog.comment_id,
                type: createReactionCommentBlog.type,
                user: {
                    user_id: createReactionCommentBlog.user.id,
                    first_name: createReactionCommentBlog.user.first_name,
                    last_name: createReactionCommentBlog.user.last_name,
                    url_avatar: createReactionCommentBlog.user.url_avatar,
                },
            });
        else return new ResponseError(400, 'Có lỗi xảy ra trong quá trình xử lí dữ liệu', false);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function getAllMyBlogs(req) {
    try {
        const user_id = req.user_id;
        const { page_index: pageIndex, search_item: searchItem } = req.query;
        const pageSize = configs.general.PAGE_SIZE;
        const whereCondition = {
            author_id: user_id,
            is_deleted: false,
            title: {
                contains: searchItem?.toString(),
            },
        };
        const category = req.query.category
            ? Array.isArray(req.query.category)
                ? req.query.category
                : [req.query.category]
            : undefined;
        const categoriesConvert = category?.map((item) => Number(item));
        const categoriesFilter = categoriesConvert?.map((item) => {
            return {
                blog_categories: {
                    some: {
                        category: {
                            id: item,
                        },
                    },
                },
            };
        });
        if (categoriesFilter) whereCondition.AND = categoriesFilter;
        const findAllMyBlogs = await configs.db.blog.findMany({
            take: pageSize,
            skip: pageSize * (Number(pageIndex) - 1),
            where: whereCondition,
            include: {
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
                reaction_blogs: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
                user: true,
            },
        });
        findAllMyBlogs.forEach((blog) => {
            console.log(blog.reaction_blogs); // Log the reaction_blogs for each blog
        });
        if (!findAllMyBlogs) return new ResponseError(404, 'Không tìm thấy blog nào', false);
        else {
            const totalRecord = await configs.db.blog.count({
                where: whereCondition,
            });
            const totalPage = Math.ceil(totalRecord / pageSize);
            const blogs = [];
            findAllMyBlogs.map((item) => {
                const reactions = item.reaction_blogs || [];
                const like = reactions.filter((reaction) => reaction.type === ReactionType.LIKE).length;
                const dislike = reactions.filter((reaction) => reaction.type === ReactionType.DISLIKE).length;
                const blog = {
                    like,
                    dislike,
                    view: item.view,
                    blog_id: item.id,
                    title: item.title,
                    content: item.content,
                    slug: item.slug,
                    url_image: item.url_image,
                    created_at: DateTime.fromISO(item.created_at.toISOString()),
                    updated_at: DateTime.fromISO(item.updated_at.toISOString()),
                    is_published: item.is_published,
                    categories: item.blog_categories?.map((cc) => {
                        return {
                            id: cc.category?.id,
                            title: cc.category?.title,
                            url_image: cc.category?.url_image,
                        };
                    }),
                    author: {
                        user_id: item.user.id,
                        first_name: item.user.first_name,
                        last_name: item.user.last_name,
                    },
                };
                return blogs.push(blog);
            });
            const blogsResponseData = {
                total_record: totalRecord,
                total_page: totalPage,
                data: blogs,
            };
            return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, blogsResponseData);
        }
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
async function getBlogBySlug(req) {
    try {
        const { slug } = req.params;

        const getBlog = await configs.db.blog.findFirst({
            where: {
                slug: slug,
                is_deleted: false,
            },
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
                reaction_blogs: {
                    select: {
                        type: true,
                        id: true,
                        user: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                url_avatar: true,
                            },
                        },
                    },
                },
                comment_blogs: {
                    where: {
                        parent_id: null,
                    },
                    orderBy: {
                        updated_at: 'desc',
                    },
                    include: {
                        user: true,
                        reactions: {
                            include: {
                                user: true,
                            },
                        },
                        replies: {
                            orderBy: {
                                updated_at: 'desc',
                            },
                            include: {
                                user: true,
                                reactions: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        // getBlog.comment_blogs.map((cm) => {
        //     console.log(cm); // Log the reaction_blogs for each blog
        // });
        if (!getBlog) return new ResponseError(404, 'Không tìm thấy blog', false);
        const reactions = getBlog.reaction_blogs || [];
        const like = reactions.filter((reaction) => reaction.type === ReactionType.LIKE).length;
        const dislike = reactions.filter((reaction) => reaction.type === ReactionType.DISLIKE).length;
        const blog = {
            like,
            dislike,
            view: getBlog.view,
            blog_id: getBlog.id,
            title: getBlog.title,
            content: getBlog.content,
            slug: getBlog.slug,
            url_image: getBlog.url_image,
            created_at: DateTime.fromISO(getBlog.created_at.toISOString()),
            updated_at: DateTime.fromISO(getBlog.updated_at.toISOString()),
            is_published: getBlog.is_published,
            reactions_blog: getBlog.reaction_blogs,
            author: {
                user_id: getBlog.user.id,
                first_name: getBlog.user.first_name,
                last_name: getBlog.user.last_name,
                url_avatar: getBlog.user.url_avatar,
            },
            categories: getBlog.blog_categories.map((cc) => {
                return {
                    category_id: cc.category?.id,
                    title: cc.category?.title,
                    url_image: cc.category?.url_image,
                };
            }),
            comments: getBlog.comment_blogs.map((cm) => {
                const reactions = cm.reactions || [];
                const like = reactions.filter((reaction) => reaction.type === ReactionType.LIKE).length;
                const dislike = reactions.filter((reaction) => reaction.type === ReactionType.DISLIKE).length;
                const replies = cm.replies.map((rl) => {
                    const reactions = rl.reactions || [];
                    const like = reactions.filter((reaction) => reaction.type === ReactionType.LIKE).length;
                    const dislike = reactions.filter((reaction) => reaction.type === ReactionType.DISLIKE).length;
                    return {
                        reply_id: rl.id,
                        content: rl.content,
                        like,
                        dislike,
                        user_id: rl.user.id,
                        user_first_name: rl.user.first_name,
                        user_last_name: rl.user.last_name,
                        user_url_avatar: rl.user.url_avatar,
                        updated_at: rl.updated_at,
                        reactions: rl.reactions.map((reaction) => ({
                            reaction_id: reaction.id,
                            type: reaction.type,
                            user: {
                                user_id: reaction.user.id,
                                user_first_name: reaction.user.first_name,
                                user_last_name: reaction.user.last_name,
                                user_url_avatar: reaction.user.url_avatar,
                            },
                        })),
                    };
                });

                return {
                    comment_id: cm.id,
                    content: cm.content,
                    like,
                    dislike,
                    user_id: cm.user.id,
                    user_first_name: cm.user.first_name,
                    user_last_name: cm.user.last_name,
                    user_url_avatar: cm.user.url_avatar,
                    updated_at: cm.updated_at,
                    reactions: cm.reactions.map((reaction) => ({
                        reaction_id: reaction.id,
                        type: reaction.type,
                        user: {
                            user_id: reaction.user.id,
                            user_first_name: reaction.user.first_name,
                            user_last_name: reaction.user.last_name,
                            user_url_avatar: reaction.user.url_avatar,
                        },
                    })),
                    replies,
                };
            }),
        };
        return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, blog);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
}
const increaseViewBlog = async (req) => {
    try {
        const { slug } = req.params;
        const increaseView = await configs.db.blog.update({
            where: {
                slug,
            },
            data: {
                view: {
                    increment: 1,
                },
            },
        });

        if (!increaseView) return new ResponseError(404, 'Không tìm thấy dữ liệu', false);
        return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
const top5RelatedBySlug = async (req) => {
    try {
        const { slug } = req.params;

        const getBlog = await configs.db.blog.findFirst({
            where: {
                slug: slug,
            },
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        if (!getBlog) return new ResponseError(404, 'Không tìm thấy blog', false);
        const categoryIds = getBlog.blog_categories.map((bc) => bc.category.id);

        const getListBlogs = await configs.db.blog.findMany({
            take: 10,
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
                reaction_blogs: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
            orderBy: {
                view: 'desc',
            },
            where: {
                id: {
                    not: getBlog.id,
                },
                blog_categories: {
                    some: {
                        category: {
                            id: {
                                in: categoryIds,
                            },
                        },
                    },
                },
                is_deleted: false,
                is_published: true,
            },
        });
        if (!getListBlogs) return new ResponseError(404, 'Không tìm thấy blog', false);
        const blogs = [];
        getListBlogs.map((item) => {
            const reaction = item.reaction_blogs.length;
            const like = item.reaction_blogs.filter((reaction) => reaction.type === ReactionType.LIKE).length;
            const dislike = reaction - like;
            const blog = {
                like,
                dislike,
                view: item.view,
                blog_id: item.id,
                title: item.title,
                content: item.content,
                slug: item.slug,
                url_image: item.url_image,
                created_at: DateTime.fromISO(item.created_at.toISOString()),
                updated_at: DateTime.fromISO(item.updated_at.toISOString()),
                is_published: item.is_published,
                author: {
                    user_id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                },
                categories: item.blog_categories.map((cc) => {
                    return {
                        id: cc.category?.id,
                        title: cc.category?.title,
                        url_image: cc.category?.url_image,
                    };
                }),
            };
            return blogs.push(blog);
        });

        return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, blogs);
    } catch (error) {
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
const getNewestBlogWithPagination = async (req) => {
    try {
        const { page_index: pageIndex } = req.query;

        const pageSize = configs.general.PAGE_SIZE;
        const getListBlogs = await configs.db.blog.findMany({
            skip: pageSize * (Number(pageIndex) - 1),
            take: pageSize,
            where: {
                is_deleted: false,
                is_published: true,
            },
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
                reaction_blogs: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        if (!getListBlogs) return new ResponseError(404, 'Không tìm thấy blog', false);
        const totalRecord = await configs.db.blog.count({
            where: {
                is_deleted: false,
                is_published: true,
            },
        });
        const totalPage = Math.ceil(totalRecord / pageSize);
        const blogs = [];
        getListBlogs.map((item) => {
            const reaction = item.reaction_blogs.length;
            const like = item.reaction_blogs.filter((reaction) => reaction.type === ReactionType.LIKE).length;
            const dislike = reaction - like;
            const blog = {
                like,
                dislike,
                view: item.view,
                blog_id: item.id,
                title: item.title,
                content: item.content,
                slug: item.slug,
                url_image: item.url_image,
                created_at: DateTime.fromISO(item.created_at.toISOString()),
                updated_at: DateTime.fromISO(item.updated_at.toISOString()),
                is_published: item.is_published,
                author: {
                    user_id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                },
                categories: item.blog_categories.map((cc) => {
                    return {
                        id: cc.category?.id,
                        title: cc.category?.title,
                        url_image: cc.category?.url_image,
                    };
                }),
            };
            return blogs.push(blog);
        });
        const blogsResponseData = {
            total_record: totalRecord,
            total_page: totalPage,
            data: blogs,
        };

        return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, blogsResponseData);
    } catch (error) {
        console.log(error);
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
const top10Like = async (req) => {
    try {
        const getListBlogs = await configs.db.blog.findMany({
            take: 10,
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
                reaction_blogs: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
            where: {
                is_published: true,
                is_deleted: false,
            },
        });
        if (!getListBlogs) return new ResponseError(404, 'Không tìm thấy blog', false);
        const blogs = [];
        getListBlogs.map((item) => {
            const reaction = item.reaction_blogs.length;
            const like = item.reaction_blogs.filter((reaction) => reaction.type === ReactionType.LIKE).length;
            const dislike = reaction - like;
            const blog = {
                like,
                dislike,
                view: item.view,
                blog_id: item.id,
                title: item.title,
                content: item.content,
                slug: item.slug,
                url_image: item.url_image,
                created_at: DateTime.fromISO(item.created_at.toISOString()),
                updated_at: DateTime.fromISO(item.updated_at.toISOString()),
                is_published: item.is_published,
                author: {
                    user_id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                },
                categories: item.blog_categories.map((cc) => {
                    return {
                        id: cc.category?.id,
                        title: cc.category?.title,
                        url_image: cc.category?.url_image,
                    };
                }),
            };
            return blogs.push(blog);
        });

        blogs.sort((a, b) => b.like - a.like);

        return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, blogs);
    } catch (error) {
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
const top10View = async (req) => {
    try {
        const getListBlogs = await configs.db.blog.findMany({
            take: 10,
            include: {
                user: true,
                blog_categories: {
                    include: {
                        category: true,
                    },
                },
                reaction_blogs: {
                    select: {
                        id: true,
                        type: true,
                    },
                },
            },
            orderBy: {
                view: 'desc',
            },
            where: {
                is_published: true,
                is_deleted: false,
            },
        });
        if (!getListBlogs) return new ResponseError(404, 'Không tìm thấy blog', false);
        const blogs = [];
        getListBlogs.map((item) => {
            const reaction = item.reaction_blogs.length;
            const like = item.reaction_blogs.filter((reaction) => reaction.type === ReactionType.LIKE).length;
            const dislike = reaction - like;
            const blog = {
                like,
                dislike,
                view: item.view,
                blog_id: item.id,
                title: item.title,
                content: item.content,
                slug: item.slug,
                url_image: item.url_image,
                created_at: DateTime.fromISO(item.created_at.toISOString()),
                updated_at: DateTime.fromISO(item.updated_at.toISOString()),
                is_published: item.is_published,
                author: {
                    user_id: item.user.id,
                    first_name: item.user.first_name,
                    last_name: item.user.last_name,
                },
                categories: item.blog_categories.map((cc) => {
                    return {
                        id: cc.category?.id,
                        title: cc.category?.title,
                        url_image: cc.category?.url_image,
                    };
                }),
            };
            return blogs.push(blog);
        });

        return new ResponseSuccess(200, 'Lấy dữ liệu thành công', true, blogs);
    } catch (error) {
        return new ResponseError(500, 'Lỗi máy chủ nội bộ', false);
    }
};
module.exports = {
    createBlog,
    updateBlog,
    changeStatusBlog,
    deleteBlog,
    getAllPagingBlog,
    handleReactionBlog,
    createCommentBlog,
    updateCommentBlog,
    deleteCommentBlog,
    getCommentBlogById,
    handleReactionCommentBlog,
    getAllMyBlogs,
    getBlogBySlug,
    increaseViewBlog,
    top5RelatedBySlug,
    getNewestBlogWithPagination,
    top10Like,
    top10View,
};
