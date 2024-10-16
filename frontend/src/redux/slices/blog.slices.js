import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { blogApis } from '../../api';
const createBlog = createAsyncThunk('blog/create', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.createBlog(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const updateBlog = createAsyncThunk('blog/update', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.updateBlog(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const changeStatusBlog = createAsyncThunk('blog/status', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.changeStatusBlog(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const deleteBlog = createAsyncThunk('blog/delete', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.deleteBlog(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const getBlogBySlug = createAsyncThunk('blog/get', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.getBlogBySlug(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const getAllMyBlogs = createAsyncThunk('blog/my-all', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.getAllMyBlogs(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const uploadPhotosInBlog = createAsyncThunk('blog/photo_in_blog', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.uploadPhotosInBlog(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});

const getNewestBlogWithPagination = createAsyncThunk('blog/newest', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.getNewestBlogWithPagination(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const top10Like = createAsyncThunk('blog/top-like', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.top10Like();
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const top10View = createAsyncThunk('blog/top-view', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.top10View();
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const top5RelatedBySlug = createAsyncThunk('blog/related', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.top5RelatedBySlug(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const increaseViewBlog = createAsyncThunk('blog/view/', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.increaseViewBlog(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const getAllPagingBlog = createAsyncThunk('blog/search', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.getAllPagingBlog(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const handleReactionBlog = createAsyncThunk('blog/reaction', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.handleReactionBlog(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const uploadPhotosInComment = createAsyncThunk('blog/photo_in_comment', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.uploadPhotosInComment(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const createCommentBlog = createAsyncThunk('blog/comment/create', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.createCommentBlog(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const updateCommentBlog = createAsyncThunk('blog/comment/update', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.updateCommentBlog(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const deleteCommentBlog = createAsyncThunk('blog/comment/delete', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.deleteCommentBlog(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const getCommentBlogById = createAsyncThunk('blog/comment/getById', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.getCommentBlogById(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const handleReactionCommentBlog = createAsyncThunk('blog/comment/reaction', async (body, ThunkAPI) => {
    try {
        const response = await blogApis.handleReactionCommentBlog(body);
        return response.data;
    } catch (error) {
        return ThunkAPI.rejectWithValue(error.data);
    }
});
const initialState = {
    blogs: [],
    comments: [],
    top10Like: [],
    top10View: [],
    relatedBlogs: [],
    files: [], // for upload photo in blog
    blog: {
        blog_id: 0,
        title: '',
        url_image: '',
        content: '',
        author: {
            first_name: '',
            last_name: '',
            email: '',
            url_avatar: '',
            user_id: undefined,
            description: '',
            is_admin: false,
        },
        reactions_blog: [],
        categories: [],
        comments: [],
        is_published: false,
        slug: '',
        view: 0,
        like: 0,
        dislike: 0,
    },
    comment: {
        comment_id: 0,
        content: '',
        like: 0,
        dislike: 0,
        user_id: 0,
        user_first_name: '',
        user_last_name: '',
        user_url_avatar: '',
        updated_at: '',
        reactions: [],
        replies: [],
    },
    currentBlogReact: '',
    totalPage: 0,
    totalRecord: 0,
    isLoading: false,
    isGetLoading: false,
};
const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        setBlog: (state, action) => {
            state.blog = action.payload;
        },
        setBlogPublished: (state, action) => {
            state.blog.is_published = action.payload;
        },
        setComments: (state, action) => {
            state.blog.comments = action.payload; // Đặt lại bình luận
        },
        addComment: (state, action) => {
            state.blog = {
                ...state.blog,
                comments: [action.payload, ...state.blog.comments], // Thêm vào đầu mảng
            };
        },
        updateComment: (state, action) => {
            const updatedComment = action.payload;
            const updatedComments = state.blog.comments.map((comment) =>
                comment.comment_id === updatedComment.comment_id ? updatedComment : comment
            );
            state.blog.comments = updatedComments;
        },
        deleteComment: (state, action) => {
            const commentIdToRemove = action.payload;
            state.blog.comments = state.blog.comments.filter((comment) => comment.comment_id !== commentIdToRemove);
        },
        // Thêm reply vào comment
        addReply: (state, action) => {
            const { comment_id, ...reply } = action.payload; // Tách comment_id và giữ lại các thuộc tính khác của reply
            state.blog.comments = state.blog.comments.map((comment) => {
                if (comment.comment_id === comment_id) {
                    return {
                        ...comment,
                        replies: [reply, ...comment.replies], // Thêm reply vào đầu mảng replies
                    };
                }
                return comment;
            });
        },

        // Cập nhật reply trong comment
        updateReply: (state, action) => {
            const { reply_id, comment_id, ...updatedData } = action.payload; // Tách reply_id, comment_id và giữ lại các thuộc tính cập nhật
            state.blog.comments = state.blog.comments.map((comment) => {
                if (comment.comment_id === comment_id) {
                    return {
                        ...comment,
                        replies: comment.replies.map(
                            (reply) => (reply.reply_id === reply_id ? { ...reply, ...updatedData } : reply) // Cập nhật reply
                        ),
                    };
                }
                return comment;
            });
        },

        // Xóa reply khỏi comment
        deleteReply: (state, action) => {
            const { reply_id, comment_id } = action.payload; // Lấy reply_id và comment_id từ payload
            state.blog.comments = state.blog.comments.map((comment) => {
                if (comment.comment_id === comment_id) {
                    return {
                        ...comment,
                        replies: comment.replies.filter((reply) => reply.reply_id !== reply_id), // Lọc bỏ reply
                    };
                }
                return comment;
            });
        },
        handleReaction: (state, action) => {
            const updatedReaction = action.payload;
            const { comment_id, user, type_req, parent_id } = updatedReaction;
            if (parent_id) {
                // Tìm comment chứa reply đó
                const parentComment = state.blog.comments.find((comment) => comment.comment_id === parent_id);

                if (parentComment) {
                    // Tìm reply tương ứng trong replies của comment
                    const replyToUpdate = parentComment.replies.find((reply) => reply.reply_id === comment_id);

                    if (replyToUpdate) {
                        // Cập nhật số lượng like và dislike trong reply
                        replyToUpdate.like = updatedReaction.like;
                        replyToUpdate.dislike = updatedReaction.dislike;

                        // Cập nhật phản ứng (reaction) cho reply
                        if (type_req === 'DELETE' || type_req === 'UPDATE') {
                            // Loại bỏ phản ứng cũ nếu là yêu cầu xóa hoặc cập nhật
                            replyToUpdate.reactions = replyToUpdate.reactions.filter(
                                (reaction) => reaction.user.user_id !== user.user_id
                            );
                        }

                        if (type_req === 'CREATE' || type_req === 'UPDATE') {
                            // Thêm mới hoặc cập nhật phản ứng (sau khi đã xóa phản ứng cũ nếu có)
                            replyToUpdate.reactions.push(updatedReaction);
                        }
                    }
                }
            } else {
                // Tìm bình luận tương ứng
                const commentToUpdate = state.blog.comments.find((comment) => comment.comment_id === comment_id);

                if (commentToUpdate) {
                    // Cập nhật số lượng like và dislike trong bình luận
                    commentToUpdate.like = updatedReaction.like;
                    commentToUpdate.dislike = updatedReaction.dislike;
                    console.log('like update:', updatedReaction.like);
                    console.log('dislike update:', updatedReaction.dislike);

                    commentToUpdate.reactions.findIndex((reaction) => reaction.user.user_id === user.user_id);

                    if (type_req === 'DELETE' || type_req === 'UPDATE') {
                        // Loại bỏ phản ứng cũ nếu là yêu cầu xóa hoặc cập nhật
                        commentToUpdate.reactions = commentToUpdate.reactions.filter(
                            (reaction) => reaction.user.user_id !== user.user_id
                        );
                    }

                    if (type_req === 'CREATE' || type_req === 'UPDATE') {
                        // Thêm mới hoặc cập nhật phản ứng (sau khi đã xóa phản ứng cũ nếu có)
                        commentToUpdate.reactions.push(updatedReaction);
                    }
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createBlog.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(createBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteBlog.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(changeStatusBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(changeStatusBlog.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(changeStatusBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateBlog.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getAllMyBlogs.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllMyBlogs.fulfilled, (state, action) => {
            state.blogs = action.payload.data?.data;
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.isGetLoading = false;
        });
        builder.addCase(getAllMyBlogs.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getBlogBySlug.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getBlogBySlug.fulfilled, (state, action) => {
            state.blog = action.payload.data;
            state.isGetLoading = false;
        });
        builder.addCase(getBlogBySlug.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(uploadPhotosInBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(uploadPhotosInBlog.fulfilled, (state, action) => {
            state.files = action.payload.data;
            state.isLoading = false;
        });
        builder.addCase(uploadPhotosInBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(uploadPhotosInComment.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(uploadPhotosInComment.fulfilled, (state, action) => {
            state.files = action.payload.data;
            state.isLoading = false;
        });
        builder.addCase(uploadPhotosInComment.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getNewestBlogWithPagination.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getNewestBlogWithPagination.fulfilled, (state, action) => {
            state.blogs = action.payload.data.data;
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.isGetLoading = false;
        });
        builder.addCase(getNewestBlogWithPagination.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(increaseViewBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(increaseViewBlog.fulfilled, (state) => {
            state.blog.view += 1;
            state.isLoading = false;
        });
        builder.addCase(increaseViewBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(top10Like.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(top10Like.fulfilled, (state, action) => {
            state.top10Like = action.payload.data;
            state.isGetLoading = false;
        });
        builder.addCase(top10Like.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(top10View.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(top10View.fulfilled, (state, action) => {
            state.top10View = action.payload.data;
            state.isGetLoading = false;
        });
        builder.addCase(top10View.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(top5RelatedBySlug.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(top5RelatedBySlug.fulfilled, (state, action) => {
            state.relatedBlogs = action.payload.data;
            state.isGetLoading = false;
        });
        builder.addCase(top5RelatedBySlug.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getAllPagingBlog.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllPagingBlog.fulfilled, (state, action) => {
            state.blogs = action.payload.data.data;
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.isGetLoading = false;
        });
        builder.addCase(getAllPagingBlog.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(handleReactionBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(handleReactionBlog.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(handleReactionBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(createCommentBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createCommentBlog.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(createCommentBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateCommentBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateCommentBlog.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(updateCommentBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteCommentBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteCommentBlog.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteCommentBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getCommentBlogById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getCommentBlogById.fulfilled, (state, action) => {
            (state.comment = action.payload.data), (state.isLoading = false);
        });
        builder.addCase(getCommentBlogById.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(handleReactionCommentBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(handleReactionCommentBlog.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(handleReactionCommentBlog.rejected, (state) => {
            state.isLoading = false;
        });
    },
});
const {
    setBlog,
    setComments,
    addComment,
    updateComment,
    deleteComment,
    handleReaction,
    addReply,
    updateReply,
    deleteReply,
} = blogSlice.actions;

export {
    createBlog,
    updateBlog,
    changeStatusBlog,
    deleteBlog,
    getAllMyBlogs,
    getBlogBySlug,
    uploadPhotosInBlog,
    setBlog,
    setComments,
    addComment,
    updateComment,
    deleteComment,
    addReply,
    updateReply,
    deleteReply,
    handleReaction,
    getNewestBlogWithPagination,
    top10Like,
    top10View,
    top5RelatedBySlug,
    increaseViewBlog,
    getAllPagingBlog,
    handleReactionBlog,
    uploadPhotosInComment,
    createCommentBlog,
    updateCommentBlog,
    deleteCommentBlog,
    getCommentBlogById,
    handleReactionCommentBlog,
};
export default blogSlice.reducer;
