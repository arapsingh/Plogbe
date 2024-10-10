import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Form, Upload } from 'antd';
import { SendOutlined, CloseCircleOutlined } from '@ant-design/icons';
import TextEditorComment from '../../../components/TextEditorComment.jsx';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import toast from 'react-hot-toast';
import { blogActions } from '../../../redux/slices/index.js';
import PropTypes from 'prop-types';
import { updateCommentBlogValidationSchema } from '../../../validations/blog.js';
import { io } from 'socket.io-client'; // Đảm bảo đã import io
const UpdateCommentEditor = ({ comment, handleCancelUpdateComment }) => {
    const commentRef = useRef(null); // Sử dụng useRef thay vì useState
    const dispatch = useAppDispatch();
    const resetEditor = () => {
        if (commentRef.current) {
            commentRef.current.resetContent(); // Reset nội dung editor về rỗng
        }
    };
    // const yupSync = {
    //     async validator({ field }, value) {
    //         await createCommentBlogValidationSchema.validateSyncAt(field, { [field]: value });
    //     },
    // };
    const handleUpdateCommentSubmit = async () => {
        try {
            const content = commentRef.current.getContent();
            const hasImage = /<img\s+[^>]*src="([^"]*)"[^>]*>/i.test(content);
            let contentData;
            if (commentRef.current) {
                if (hasImage) {
                    const result = await commentRef.current.handleSaveImageComment(comment, false);
                    if (result.success) {
                        contentData = result.data;
                    } else {
                        throw new Error('Lưu nội dung không thành công.');
                    }
                } else {
                    contentData = content;
                }
            }
            await updateCommentBlogValidationSchema.validate({
                comment_id: comment.comment_id ? comment.comment_id : comment.reply_id, // Giả sử bạn có blog_id từ props
                content: contentData,
            });
            const data = {
                comment_id: comment.comment_id ? comment.comment_id : comment.reply_id,
                content: contentData,
            };
            const response = await dispatch(blogActions.updateCommentBlog(data));
            // let socket; // Khai báo socket ở đây
            if (response.payload.status_code === 200) {
                // socket = io.connect(process.env.REACT_APP_API_URL || 'http://localhost:3001');
                const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001', {
                    extraHeaders: {
                        'X-Requested-With': 'XMLHttpRequest', // Thêm header tại đây
                    },
                    // transports: ['websocket', 'polling'], // Chọn các phương thức truyền tải nếu cần
                });
                if (comment.comment_id) {
                    socket.emit('update-comment', {
                        content: contentData,
                        comment_id: comment.comment_id,
                        // user_id: currentUser.user_id, // Có thể thêm thông tin người dùng nếu cần
                    });
                } else {
                    socket.emit('update-reply', {
                        content: contentData,
                        comment_id: comment.reply_id,
                        // user_id: currentUser.user_id, // Có thể thêm thông tin người dùng nếu cần
                    });
                }
                toast.success(response.payload.message);
                handleCancelUpdateComment();
                // dispatch(blogActions.getBlogBySlug(blog.slug));
                resetEditor(); // Gọi hàm reset editor sau khi gửi thành công
                // navigate('/my-blog');
                // setIsSaveVisible(!isSaveVisible);
            } else {
                toast.error(response.payload.message);
            }
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra.');
        }
    };
    const handleChangeContent = (content) => {
        return;
    };
    return (
        <div>
            <Form.Item>
                <TextEditorComment
                    ref={commentRef}
                    height={200}
                    content={comment.content}
                    handleChangeContent={(content) => {
                        handleChangeContent(content);
                    }}
                />
                <div className="flex items-end justify-end">
                    <Button type="primary" icon={<SendOutlined />} onClick={handleUpdateCommentSubmit}>
                        Cập nhật
                    </Button>
                    <Button
                        type="primary"
                        className="bg-error mr-10 ml-4"
                        icon={<CloseCircleOutlined />}
                        onClick={handleCancelUpdateComment}
                    >
                        Hủy
                    </Button>
                </div>
            </Form.Item>
        </div>
    );
};
UpdateCommentEditor.propTypes = {
    // handleCreateCommentBlog: PropTypes.func, // Kiểu cho hàm tạo bình luận
    // handleUpdateCommentBlog: PropTypes.func, // Kiểu cho hàm cập nhật bình luận
    // handleCancel: PropTypes.func, // Kiểu cho hàm hủy
    comment: PropTypes.any,
    handleCancelUpdateComment: PropTypes.func,
};
export default UpdateCommentEditor;
