import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Form, Upload } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import TextEditorComment from '../../../components/TextEditorComment.jsx';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import toast from 'react-hot-toast';
import { blogActions } from '../../../redux/slices/index.js';
import PropTypes from 'prop-types';
import { createCommentBlogValidationSchema } from '../../../validations/blog.js';
import { io } from 'socket.io-client';
const CreateCommentEditor = ({ blog, comment, setIsOpenReplyEditor, parentCommentId }) => {
    const commentRef = useRef(null);
    const dispatch = useAppDispatch();
    const resetEditor = () => {
        if (commentRef.current) {
            commentRef.current.resetContent();
        }
    };
    const yupSync = {
        async validator({ field }, value) {
            await createCommentBlogValidationSchema.validateSyncAt(field, { [field]: value });
        },
    };
    // const findParentCommentId = (comments, replyId) => {
    //     for (const comment of comments) {
    //         // Duyệt qua các reply trong comment
    //         for (const reply of comment.replies) {
    //             if (reply.reply_id === replyId) {
    //                 return comment.comment_id; // Trả về comment_id của comment cha
    //             }
    //         }
    //     }
    //     return null; // Không tìm thấy comment cha
    // };
    const handleCommentSubmit = async () => {
        try {
            const content = commentRef.current.getContent();
            const hasImage = /<img\s+[^>]*src="([^"]*)"[^>]*>/i.test(content);
            let contentData;
            if (commentRef.current) {
                if (hasImage) {
                    const result = await commentRef.current.handleSaveImageComment('', true);
                    if (result.success) {
                        contentData = result.data;
                    } else {
                        throw new Error('Lưu nội dung không thành công.');
                    }
                } else {
                    contentData = content;
                }
            }
            // const parentCommentId = findParentCommentId(blog.comments, comment.reply_id);
            await createCommentBlogValidationSchema.validate({
                blog_id: blog.blog_id, // Giả sử bạn có blog_id từ props
                content: contentData,
                parent_id: comment?.comment_id ? comment.comment_id : parentCommentId ? parentCommentId : null,
            });
            const data = {
                blog_id: blog.blog_id,
                content: contentData,
                ...(comment?.comment_id
                    ? { parent_id: comment.comment_id }
                    : parentCommentId
                      ? { parent_id: parentCommentId }
                      : {}),
            };
            const response = await dispatch(blogActions.createCommentBlog(data));
            let socket; // Khai báo socket ở đây
            if (response.payload.status_code === 200) {
                // socket = io.connect(process.env.REACT_APP_API_URL || 'http://localhost:3001');
                const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001', {
                    extraHeaders: {
                        'X-Requested-With': 'XMLHttpRequest', // Thêm header tại đây
                    },
                    transports: ['websocket', 'polling'], // Chọn các phương thức truyền tải nếu cần
                });
                if (!parentCommentId){
                    socket.emit('new-comment', {
                        content: contentData,
                        blog_id: blog.blog_id,
                        // user_id: currentUser.user_id, // Có thể thêm thông tin người dùng nếu cần
                    });
                }else {
                    socket.emit('new-reply', {
                        content: contentData,
                        blog_id: blog.blog_id,
                        parent_id: parentCommentId,
                    });
                }
                toast.success(response.payload.message);
                dispatch(blogActions.getBlogBySlug(blog.slug));
                resetEditor(); // Gọi hàm reset editor sau khi gửi thành công
                if (setIsOpenReplyEditor) {
                    setIsOpenReplyEditor(false);
                }
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
                    content=""
                    handleChangeContent={(content) => {
                        handleChangeContent(content);
                    }}
                />
                <div className="flex items-end justify-end">
                    <Button type="primary" icon={<SendOutlined />} onClick={handleCommentSubmit}>
                        Gửi
                    </Button>
                </div>
            </Form.Item>
        </div>
    );
};
CreateCommentEditor.propTypes = {
    blog: PropTypes.any.isRequired,
    comment: PropTypes.any,
    setIsOpenReplyEditor: PropTypes.func,
    parentCommentId: PropTypes.number,
};

export default CreateCommentEditor;
