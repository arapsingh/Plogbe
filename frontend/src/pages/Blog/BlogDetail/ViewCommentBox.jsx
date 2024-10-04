import Spin from '../../../components/Spin';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import PropTypes from 'prop-types';
import { RollbackOutlined } from '@ant-design/icons';
import { convertDateTimeFormat } from '../../../utils/helper.js';
import { DefaultAvatar } from '../../../assets/images/index.js';
import { useEffect, useRef, useState } from 'react';
import { EllipsisOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import '../../../App.css';
import { Dropdown, Menu, Popover } from 'antd';
import UpdateCommentEditor from './UpdateCommentEditor.jsx';
import ConfirmDialog from '../../../components/ConfirmDialog.jsx';
import { blogActions } from '../../../redux/slices/index.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { handleReaction } from '../../../redux/slices/blog.slices.js';
import CreateCommentEditor from './CreateCommentEditor.jsx';
const ViewCommentBox = ({ comment, className }) => {
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
    const isLogin = useAppSelector((state) => state.userSlice.isLogin);
    const [hasImage, setHasImage] = useState(false);
    const [isLongText, setIsLongText] = useState(false);
    const [showFullText, setShowFullText] = useState(false); // To toggle between full and truncated text
    const [modifiedContent, setModifiedContent] = useState(comment.content); // State to hold modified content
    const currentUser = useAppSelector((state) => state.userSlice.currentUser);
    const isAuthorComment = currentUser && currentUser.user_id == comment.user_id;
    const blog = useAppSelector((state) => state.blogSlice.blog);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        const parser = new DOMParser();
        const contentDoc = parser.parseFromString(comment.content, 'text/html');
        const imageTags = contentDoc.getElementsByTagName('img');

        setHasImage(imageTags.length > 0);
        const textContent = contentDoc.body.textContent || '';
        setIsLongText(textContent.length > 500);
        // Apply image styles
        const images = contentDoc.getElementsByTagName('img');
        for (let img of images) {
            img.classList.add('comment-image'); // Add the CSS class for image styling
        }

        // Set the modified HTML to the state
        setModifiedContent(contentDoc.body.innerHTML);
    }, [comment.content]);
    const toggleTextDisplay = () => {
        setShowFullText(!showFullText);
    };
    const renderContent = () => {
        if (isLongText && !showFullText) {
            const truncatedText = modifiedContent.slice(0, 500) + '...';
            return (
                <div
                    className="ql-editor blog-content max-h-dvh overflow-auto"
                    dangerouslySetInnerHTML={{ __html: truncatedText }}
                ></div>
            );
        } else {
            return <div className="ql-editor blog-content" dangerouslySetInnerHTML={{ __html: modifiedContent }}></div>;
        }
    };
    const [isCommentEditorOpen, setIsCommentEditorOpen] = useState(false);
    const handleCancelUpdateComment = () => {
        setIsCommentEditorOpen(false);
    };
    const findParentCommentId = (comments, replyId) => {
        for (const comment of comments) {
            // Duyệt qua các reply trong comment
            for (const reply of comment.replies) {
                if (reply.reply_id === replyId) {
                    return comment.comment_id; // Trả về comment_id của comment cha
                }
            }
        }
        return null; // Không tìm thấy comment cha
    };
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const parent = findParentCommentId(blog.comments, comment.reply_id);
    const handleDeleteCommentClick = () => {
        dispatch(blogActions.deleteCommentBlog(comment.comment_id ? comment.comment_id : comment.reply_id)).then(
            (response) => {
                let socket;
                if (response.payload.status_code == 200) {
                    socket = io.connect(process.env.REACT_APP_API_URL || 'http://localhost:3001');
                    if (comment.comment_id) {
                        socket.emit('delete-comment', {
                            comment_id: comment.comment_id,
                        });
                    } else {
                        socket.emit('delete-reply', {
                            reply_id: comment.reply_id,
                            comment_id: parent,
                        });
                    }
                    toast.success(response.payload.message);
                    setIsOpenDeleteModal(false);
                } else {
                    toast.error(response.payload.message);
                }
            }
        );
    };
    const [visibleCount, setVisibleCount] = useState(5); // Số bản ghi hiển thị ban đầu
    const listRef = useRef(null); // Tham chiếu đến danh sách người dùng
    const handleLoadMore = () => {
        if (listRef.current) {
            const currentScrollHeight = listRef.current.scrollHeight; // Chiều cao hiện tại của danh sách
            const newVisibleCount = visibleCount + 5; // Tăng số bản ghi hiển thị
            setVisibleCount(newVisibleCount); // Cập nhật số bản ghi hiển thị

            // Sau khi cập nhật, cuộn thanh đến vị trí mới của các bản ghi
            setTimeout(() => {
                // Đợi cho bản ghi mới được hiển thị rồi cuộn
                listRef.current.scrollTop = currentScrollHeight; // Cuộn đến cuối danh sách
            }, 0);
        }
    };

    // Thu gọn danh sách về 5 bản ghi
    const handleCollapse = () => {
        setVisibleCount(5);
        if (listRef.current) {
            listRef.current.scrollTop = 0; // Đặt lại vị trí thanh cuộn về đầu
        }
    };
    const ExpandableList = ({ users }) => {
        return (
            <div>
                <div ref={listRef} className={`overflow-y-auto ${users.length > 10 ? 'max-h-80' : ''}`}>
                    {users.slice(0, visibleCount).map((user) => (
                        <div key={user.user_id} className="flex items-center mb-2">
                            <img
                                src={user.user_url_avatar || DefaultAvatar}
                                alt={`${user.user_first_name} ${user.user_last_name}`}
                                className="w-8 h-8 rounded-full mr-2"
                            />
                            <span>
                                {user.user_first_name} {user.user_last_name}
                            </span>
                        </div>
                    ))}

                    {visibleCount < users.length && users.length > 5 ? (
                        // Hiển thị nút "Xem thêm" nếu còn bản ghi chưa hiển thị và tổng số bản ghi lớn hơn 5
                        <div className="text-center mt-4">
                            <span
                                onClick={handleLoadMore}
                                className="text-blue-500 underline cursor-pointer hover:text-blue-600"
                            >
                                Xem thêm...
                            </span>
                        </div>
                    ) : (
                        // Hiển thị nút "Thu gọn" khi đã hiển thị hết bản ghi và tổng số bản ghi lớn hơn 5
                        visibleCount >= users.length &&
                        users.length > 5 && (
                            <div className="text-center mt-4">
                                <span
                                    onClick={handleCollapse}
                                    className="text-red-500 underline cursor-pointer hover:text-red-600"
                                >
                                    Thu gọn...
                                </span>
                            </div>
                        )
                    )}
                </div>
            </div>
        );
    };
    ExpandableList.propTypes = {
        users: PropTypes.any.isRequired,
    };
    const handleReplyCommentClick = () => {
        return;
    };
    const isLiked = comment.reactions.some(
        (reaction) => reaction.type === 'LIKE' && reaction.user.user_id === currentUser.user_id
    );
    const isDisliked = comment.reactions.some(
        (reaction) => reaction.type === 'DISLIKE' && reaction.user.user_id === currentUser.user_id
    );
    const handleReactComment = (isLike) => {
        if (!isLogin) {
            navigate('/login');
            return;
        }
        dispatch(
            blogActions.handleReactionCommentBlog({
                comment_id: comment.comment_id ? comment.comment_id : comment.reply_id,
                type: isLike ? 'LIKE' : 'DISLIKE',
            })
        ).then((response) => {
            let socket;
            if (response.payload.status_code === 200) {
                socket = io.connect(process.env.REACT_APP_API_URL || 'http://localhost:3001');
                if ((isLiked && isLike) || (isDisliked && !isLike)) {
                    // Nếu đã thích hoặc không thích và action giống như hiện tại thì xóa phản ứng
                    socket.emit('delete-reaction-comment', {
                        type_req: 'DELETE',
                        comment_id: comment.comment_id,
                        like: response.payload.data.like,
                        dislike: response.payload.data.dislike,
                        user: currentUser,
                    });
                } else if (!isLiked && !isDisliked) {
                    // Nếu không có phản ứng trước đó, tạo phản ứng mới
                    socket.emit('create-reaction-comment', {
                        type_req: 'CREATE',
                        comment_id: comment.comment_id,
                        like: response.payload.data.like,
                        dislike: response.payload.data.dislike,
                        user: currentUser,
                    });
                } else {
                    // Nếu có phản ứng ngược lại (LIKE -> DISLIKE hoặc DISLIKE -> LIKE), cập nhật phản ứng
                    socket.emit('update-reaction-comment', {
                        type_req: 'UPDATE',
                        comment_id: comment.comment_id,
                        like: response.payload.data.like,
                        dislike: response.payload.data.dislike,
                        user: currentUser,
                    });
                }
                toast.success(response.payload.message);
            } else toast.error(response.payload.message);
        });
    };
    const [isOpenReplyEditor, setIsOpenReplyEditor] = useState(false);
    return (
        <>
            {isGetLoading && <Spin />}
            {isCommentEditorOpen ? (
                <UpdateCommentEditor comment={comment} handleCancelUpdateComment={handleCancelUpdateComment} />
            ) : (
                <div
                    // className="bg-superlightorange p-6 ql-snow flex flex-col gap-1 mb-10 border-2"
                    className={`${className} bg-gray p-6 ql-snow flex flex-col gap-1 mb-10 border-2`}
                    style={{ borderRadius: '20px' }}
                >
                    <div className="flex justify-end">
                        {isAuthorComment && (
                            <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item
                                            key="edit"
                                            onClick={() => {
                                                setIsCommentEditorOpen(true);
                                            }}
                                        >
                                            Chỉnh sửa
                                        </Menu.Item>
                                        <Menu.Item
                                            key="delete"
                                            onClick={() => {
                                                setIsOpenDeleteModal(true);
                                            }}
                                        >
                                            Xóa
                                        </Menu.Item>
                                    </Menu>
                                }
                                trigger={['click']}
                            >
                                <EllipsisOutlined />
                            </Dropdown>
                        )}
                    </div>
                    {isOpenDeleteModal && (
                        <ConfirmDialog
                            visible={isOpenDeleteModal}
                            title="Xác nhận xóa"
                            content="Bạn có chắc chắn muốn Xóa không?"
                            handleConfirm={handleDeleteCommentClick}
                            handleCancel={() => setIsOpenDeleteModal(false)}
                        ></ConfirmDialog>
                    )}
                    <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-3">
                            <img
                                src={comment.user_url_avatar || DefaultAvatar}
                                alt={`${comment.user_first_name} ${comment.user_last_name}`}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className="font-semibold">
                                    {comment.user_first_name} {comment.user_last_name}
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm">{convertDateTimeFormat(comment.updated_at)}</p>
                    </div>

                    <div className="w-full bg-footer " style={{ borderRadius: '20px' }}>
                        {renderContent()}
                        {/* Show "See more" or "See less" based on the state */}
                        {isLongText && (
                            <p onClick={toggleTextDisplay} className="container text-blue-500 cursor-pointer">
                                {showFullText ? 'Rút gọn' : 'Xem thêm'}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-between items-center w-full">
                        <p
                            onClick={() => {
                                setIsOpenReplyEditor(!isOpenReplyEditor);
                            }}
                            className="flex justify-end container text-blue-500 hover:underline cursor-pointer"
                        >
                            Phản hồi
                        </p>
                        <div className="flex items-center gap-2">
                            <Popover
                                content={
                                    <ExpandableList
                                        users={comment.reactions.filter((r) => r.type === 'LIKE').map((r) => r.user)}
                                    />
                                }
                                title="Người đã like"
                                trigger="hover"
                                placement="top"
                            >
                                <LikeOutlined
                                    onClick={() => handleReactComment(true)}
                                    className={`w-6 h-6 cursor-pointer hover:text-info duration-300 transition-all ${isLiked && 'text-info'}`}
                                />
                                <p className="text-xl">{comment.like}</p>
                            </Popover>
                            <Popover
                                content={
                                    <ExpandableList
                                        users={comment.reactions.filter((r) => r.type === 'DISLIKE').map((r) => r.user)}
                                    />
                                }
                                title="Người đã dislike"
                                trigger="hover"
                                placement="top"
                            >
                                <DislikeOutlined
                                    onClick={() => handleReactComment(false)}
                                    className={`w-6 h-6 cursor-pointer hover:text-info duration-300 transition-all ${isDisliked && 'text-info'}`}
                                />
                                <p className="text-xl">{comment.dislike}</p>
                            </Popover>
                        </div>
                    </div>
                    {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                        <div>
                            {comment.replies.map((reply) => (
                                <ViewCommentBox key={reply.reply_id} comment={reply} className="bg-nav" />
                            ))}
                        </div>
                    )}
                    {isOpenReplyEditor && (
                        <CreateCommentEditor
                            blog={blog}
                            comment={comment}
                            setIsOpenReplyEditor={setIsOpenReplyEditor}
                            parentCommentId={parent}
                        ></CreateCommentEditor>
                    )}
                </div>
            )}
        </>
    );
};
ViewCommentBox.propTypes = {
    comment: PropTypes.any,
    className: PropTypes.string,
};
export default ViewCommentBox;
