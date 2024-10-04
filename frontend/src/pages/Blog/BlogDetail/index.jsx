import React, { useEffect, useRef, useState } from 'react';
import { Spin, CarouselBlogRelated } from '../../../components';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks.ts';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { blogActions } from '../../../redux/slices';
import { DefaultAvatar, Plog } from '../../../assets/images';
import { convertDateFormat } from '../../../utils/helper';
import { LikeOutlined, DislikeOutlined, EyeOutlined } from '@ant-design/icons';
import ShareButton from './ShareButton';
import PropTypes from 'prop-types';
import { Popover } from 'antd';
import CommentInput from './CreateCommentEditor.jsx';
import ViewCommentBox from './ViewCommentBox.jsx';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import {
    addComment,
    updateComment,
    deleteComment,
    handleReaction,
    addReply,
    updateReply,
    deleteReply,
} from '../../../redux/slices/blog.slices.js'; // Đảm bảo đường dẫn đúng

const BlogDetail = () => {
    const navigate = useNavigate();
    const authorRef = useRef(null);
    const bottomAuthorRef = useRef(null);
    const contentRef = useRef(null);
    const { slug } = useParams();
    const isLogin = useAppSelector((state) => state.userSlice.isLogin);
    const dispatch = useAppDispatch();
    const [isVisible, setIsVisible] = useState(false);
    const blog = useAppSelector((state) => state.blogSlice.blog);
    const comments = useAppSelector((state) => state.blogSlice.blog.comments);
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
    const isLoading = useAppSelector((state) => state.blogSlice.isLoading);
    const top5Related = useAppSelector((state) => state.blogSlice.relatedBlogs) || [];
    // const currentReact = useAppSelector((state) => state.blogSlice.currentBlogReact) || "";
    const currentUser = useAppSelector((state) => state.userSlice.currentUser);
    const isLiked = blog.reactions_blog.some(
        (reaction) => reaction.type === 'LIKE' && reaction.user.id === currentUser.user_id
    );
    const isDisliked = blog.reactions_blog.some(
        (reaction) => reaction.type === 'DISLIKE' && reaction.user.id === currentUser.user_id
    );
    useEffect(() => {
        dispatch(blogActions.getBlogBySlug(slug)).then((response) => {
            console.log('env:', process.env.REACT_APP_ENV);
            if (response.payload && response.payload.status_code !== 200) navigate('/404');
            else {
                dispatch(blogActions.top5RelatedBySlug(slug));
                // if (isLogin) {
                //     dispatch(blogActions.getUserReactBySlug(slug));
                // }
            }
        });
    }, [dispatch, slug]);

    const isMiddle = (el) => {
        return el.getBoundingClientRect().bottom <= window.innerHeight / 3;
    };
    const isBottom = (el) => {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    };
    const isBetweenBotAndMiddle = (el) => {
        return el.getBoundingClientRect().bottom <= (window.innerHeight * 2) / 3;
    };
    const trackScrolling = () => {
        const topAuthor = authorRef.current;
        const bottomAuthor = bottomAuthorRef.current;
        if (isMiddle(topAuthor)) {
            setIsVisible(true);
        } else setIsVisible(false);

        if (isBetweenBotAndMiddle(bottomAuthor)) setIsVisible(false);
        else setIsVisible(true);
    };
    const trackViewIncrease = () => {
        const contentElement = contentRef.current;
        if (isBottom(contentElement)) {
            window.removeEventListener('scroll', trackViewIncrease);
            dispatch(blogActions.increaseViewBlog(slug));
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', trackScrolling);
        window.addEventListener('scroll', trackViewIncrease);

        return () => {
            window.removeEventListener('scroll', trackScrolling);
            window.removeEventListener('scroll', trackViewIncrease);
        };
    }, []);
    const stage = process.env.REACT_APP_ENV;
    const handleReact = (isLike) => {
        if (!isLogin) {
            navigate('/login');
            return;
        }
        dispatch(blogActions.handleReactionBlog({ blog_id: blog.blog_id, type: isLike ? 'LIKE' : 'DISLIKE' })).then(
            (response) => {
                dispatch(blogActions.getBlogBySlug(slug));
            }
        );
    };
    const [visibleCount, setVisibleCount] = useState(5); // Số bản ghi hiển thị ban đầu
    const listRef = useRef(null); // Tham chiếu đến danh sách người dùng

    // Tăng số lượng bản ghi được hiển thị khi nhấn "Xem thêm"
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
                        <div key={user.id} className="flex items-center mb-2">
                            <img
                                src={user.url_avatar || DefaultAvatar}
                                alt={`${user.first_name} ${user.last_name}`}
                                className="w-8 h-8 rounded-full mr-2"
                            />
                            <span>
                                {user.first_name} {user.last_name}
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
    let socket; // Để giữ socket ở đây
    useEffect(() => {
        console.log('Component re-rendering, comments:', blog.comments);
    }, [blog.comments]);

    useEffect(() => {
        if (currentUser.user_id) {
            // Chỉ kết nối nếu người dùng đã đăng nhập
            socket = io.connect(process.env.REACT_APP_API_URL || 'http://localhost:3001');

            // Gửi userId đến server sau khi kết nối
            socket.emit('authenticate', currentUser.user_id);

            // Lắng nghe sự kiện new-comment từ server
            socket.on('new-comment', (newComment) => {
                console.log('Received new comment:', newComment);
                dispatch(addComment(newComment));
            });
            socket.on('update-comment', (editComment) => {
                console.log('Received update comment:', editComment);
                dispatch(updateComment(editComment));
            });
            socket.on('delete-comment', (comment_id) => {
                console.log('Received delete comment:', comment_id);
                dispatch(deleteComment(comment_id));
            });
            socket.on('new-reply', (newReply) => {
                console.log('Received new reply:', newReply);
                dispatch(addReply(newReply));
            });
            socket.on('update-reply', (editReply) => {
                console.log('Received update reply:', editReply);
                dispatch(updateReply(editReply));
            });
            socket.on('delete-reply', (replyId) => {
                console.log('Received delete reply:', replyId);
                dispatch(deleteReply(replyId));
            });
            socket.on('delete-reaction-comment', (reaction) => {
                console.log('Received delete reaction comment:', reaction);
                dispatch(handleReaction({ type: 'DELETE', ...reaction }));
            });

            // Lắng nghe sự kiện create-reaction-comment
            socket.on('create-reaction-comment', (reaction) => {
                console.log('Received create reaction comment:', reaction);
                dispatch(handleReaction({ type: 'CREATE', ...reaction }));
            });

            // Lắng nghe sự kiện update-reaction-comment
            socket.on('update-reaction-comment', (reaction) => {
                console.log('Received update reaction comment:', reaction);
                dispatch(handleReaction({ type: 'UPDATE', ...reaction }));
            });
            // Dọn dẹp khi component bị hủy
            return () => {
                socket.disconnect();
            };
        }
    }, [dispatch, currentUser]); // Chỉ chạy khi userId thay đổi
    // useEffect(() => {
    //     console.log('Comments updated:', blog.comments);
    // }, [dispatch, blog.comments]); // Đăng ký lại khi comments thay đổi
    return (
        <>
            {(isGetLoading || isLoading) && <Spin />}
            <div className="w-full min-h-[600px] mb-20 relative">
                <div
                    className={`fixed  w-[100px] h-[300px] top-1/4 laptop:left-[20%] transition-all duration-300 ${isVisible ? '' : 'opacity-0'}`}
                >
                    <div className="w-full h-full items-center flex flex-col gap-4">
                        <div className="flex flex-col items-center">
                            <Popover
                                content={
                                    <ExpandableList
                                        users={blog.reactions_blog.filter((r) => r.type === 'LIKE').map((r) => r.user)}
                                    />
                                }
                                title="Người đã like"
                                trigger="hover"
                                placement="top"
                            >
                                <LikeOutlined
                                    onClick={() => handleReact(true)}
                                    className={`w-6 h-6 cursor-pointer hover:text-info duration-300 transition-all ${isLiked && 'text-info'}`}
                                />
                                <p className="text-xl">{blog.like}</p>
                            </Popover>
                            <Popover
                                content={
                                    <ExpandableList
                                        users={blog.reactions_blog
                                            .filter((r) => r.type === 'DISLIKE')
                                            .map((r) => r.user)}
                                    />
                                }
                                title="Người đã dislike"
                                trigger="hover"
                                placement="top"
                            >
                                <DislikeOutlined
                                    onClick={() => handleReact(false)}
                                    className={`w-6 h-6 cursor-pointer hover:text-info duration-300 transition-all ${isDisliked && 'text-info'}`}
                                />
                                <p className="text-xl">{blog.dislike}</p>
                            </Popover>
                        </div>
                        <img
                            src={blog.author.url_avatar || Plog}
                            alt="avt-author"
                            className="rounded-full w-10 h-10 border border-gray-400"
                        />
                        <div className="flex flex-col items-center">
                            <EyeOutlined className="w-6 h-6 " />
                            <p className="text-xl">{blog.view}</p>
                        </div>
                        {stage === 'production' && <ShareButton />}
                    </div>
                </div>
                <div id="pivot" className="flex flex-col gap-5 items-start max-w-[800px] h-fit mx-auto relative">
                    <div className="bg-background p-10 ql-snow flex flex-col gap-5 ">
                        <div className="flex gap-1 mx-4 mb-2">
                            {blog.categories.length > 0 &&
                                blog.categories.map((category) => {
                                    return (
                                        <Link
                                            key={category.category_id}
                                            to={`/blog/category/${category.category_id}`}
                                            className="text-sm hover:underline hover:cursor-pointer underline-offset-1 font-semibold text-gray-500"
                                        >
                                            {category.title}
                                        </Link>
                                    );
                                })}
                        </div>
                        <p className="text-5xl font-semibold mx-4">{blog.title}</p>
                        <div id="author_info" ref={authorRef} className="flex gap-2 items-center mx-4">
                            <img
                                src={blog.author.url_avatar || Plog}
                                alt="avt-admin"
                                className="rounded-full w-14 h-14 border border-gray-400"
                            />
                            <div className="flex flex-col">
                                <p className="text-sm  font-normal ">
                                    {blog.author.first_name + ' ' + blog.author.last_name}
                                </p>
                                <p className="text-sm text-gray-500 font-normal ">
                                    {convertDateFormat(blog.updated_at)}
                                </p>
                            </div>
                        </div>
                        <div className="blog-content">
                            <img src={blog.url_image} alt="thumbnail" className="" />
                        </div>
                        <div
                            ref={contentRef}
                            className="ql-editor blog-content"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        ></div>
                        <div ref={bottomAuthorRef} className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <img
                                    src={blog.author.url_avatar || Plog}
                                    alt="avt-admin"
                                    className="rounded-full w-14 h-14 border border-gray-400"
                                />
                                <div className="flex flex-col">
                                    <p className="text-sm  font-normal ">
                                        {blog.author.first_name + ' ' + blog.author.last_name}
                                    </p>
                                    <p className="text-sm text-gray-500 font-normal ">
                                        {convertDateFormat(blog.updated_at)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Popover
                                    content={
                                        <ExpandableList
                                            users={blog.reactions_blog
                                                .filter((r) => r.type === 'LIKE')
                                                .map((r) => r.user)}
                                        />
                                    }
                                    title="Người đã like"
                                    trigger="hover"
                                    placement="top"
                                >
                                    <LikeOutlined
                                        onClick={() => handleReact(true)}
                                        className={`w-6 h-6 cursor-pointer hover:text-info duration-300 transition-all ${isLiked && 'text-info'}`}
                                    />
                                    <p className="text-xl">{blog.like}</p>
                                </Popover>
                                <Popover
                                    content={
                                        <ExpandableList
                                            users={blog.reactions_blog
                                                .filter((r) => r.type === 'DISLIKE')
                                                .map((r) => r.user)}
                                        />
                                    }
                                    title="Người đã dislike"
                                    trigger="hover"
                                    placement="top"
                                >
                                    <DislikeOutlined
                                        onClick={() => handleReact(false)}
                                        className={`w-6 h-6 cursor-pointer hover:text-info duration-300 transition-all ${isDisliked && 'text-info'}`}
                                    />
                                    <p className="text-xl">{blog.dislike}</p>
                                </Popover>
                                {stage === 'production' && <ShareButton />}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container justify-center">
                    <CommentInput blog={blog}></CommentInput>
                </div>
                <div className="container justify-center">
                    {blog.comments.length > 0 &&
                        blog.comments.map((comment) => <ViewCommentBox key={comment.comment_id} comment={comment} />)}
                </div>
                <div className="container overflow-visible">
                    {top5Related.length > 0 && <CarouselBlogRelated blogs={top5Related} />}
                </div>
            </div>
        </>
    );
};

export default BlogDetail;
