import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { convertDateFormat } from '../../utils/helper.js';
import Plog from '../../assets/images/index.js';
import { useEffect, useState, useRef } from 'react';
import { blogActions } from '../../redux/slices/index.js';
import Spin from '../../components/Spin.jsx';
import axios from 'axios';
// type BlogReviewProps = {};

const BlogReview = () => {
    const blog = useAppSelector((state) => state.blogSlice.blog);
    const dispatch = useAppDispatch();
    const {slug} = useParams();
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
    useEffect(() => {
        dispatch(blogActions.getBlogBySlug(slug));
    },[dispatch, slug]);
    const [authorAvatarUrl, setAuthorAvatarUrl] = useState('');
    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (blog.author.url_avatar) {
                    const response = await axios.get(`https://cors-pass.onrender.com/${blog.author.url_avatar}`, {
                        headers: {
                            'x-requested-with': 'XMLHttpRequest',
                        },
                        responseType: 'arraybuffer', // Chỉ định kiểu phản hồi là arraybuffer
                    });

                    // Tạo một blob từ dữ liệu nhị phân
                    const blob = new Blob([response.data], { type: 'image/png' }); // Hoặc loại hình ảnh khác nếu cần
                    const imageUrl = URL.createObjectURL(blob); // Tạo URL cho blob

                    console.log(imageUrl); // Log URL để kiểm tra
                    setAuthorAvatarUrl(imageUrl); // Cập nhật trạng thái với URL hình ảnh
                }
            } catch (error) {
                console.error('Error fetching the image:', error); // Xử lý lỗi
            }
        };

        fetchImage(); // Gọi hàm lấy hình ảnh
    }, [blog.author.url_avatar]);
    const [imageUrl, setImageUrl] = useState('');
    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (blog.url_image) {
                    const response = await axios.get(`https://cors-pass.onrender.com/${blog.url_image}`, {
                        headers: {
                            'x-requested-with': 'XMLHttpRequest',
                        },
                        responseType: 'arraybuffer', // Chỉ định kiểu phản hồi là arraybuffer
                    });

                    // Tạo một blob từ dữ liệu nhị phân
                    const blob = new Blob([response.data], { type: 'image/png' }); // Hoặc loại hình ảnh khác nếu cần
                    const imageUrl = URL.createObjectURL(blob); // Tạo URL cho blob

                    console.log(imageUrl); // Log URL để kiểm tra
                    setImageUrl(imageUrl); // Cập nhật trạng thái với URL hình ảnh
                }
            } catch (error) {
                console.error('Error fetching the image:', error); // Xử lý lỗi
            }
        };

        fetchImage(); // Gọi hàm lấy hình ảnh
    }, [blog.url_image]);
    const contentRef = useRef(null);
    useEffect(() => {
        const updateImageUrls = async () => {
            if (contentRef.current) {
                const imgElements = contentRef.current.getElementsByTagName('img');
                for (let img of imgElements) {
                    const originalUrl = img.src;
                    try {
                        const response = await axios.get(`https://cors-pass.onrender.com/${originalUrl}`, {
                            headers: {
                                'x-requested-with': 'XMLHttpRequest',
                            },
                            responseType: 'arraybuffer',
                        });

                        const blob = new Blob([response.data], { type: 'image/png' }); // Đặt loại hình ảnh phù hợp
                        const secureImageUrl = URL.createObjectURL(blob); // Tạo URL cho blob

                        img.src = secureImageUrl; // Cập nhật thuộc tính src của ảnh
                    } catch (error) {
                        console.error('Error fetching the image:', error);
                    }
                }
            }
        };

        updateImageUrls();
    }, [blog.content]);
    return (
        <>
            {isGetLoading && <Spin />}
            <div className="w-full border min-h-[600px] shadow-md">
                <div className="flex flex-col gap-5 items-start w-[800px] h-fit mx-auto">
                    <Link
                        to={`/my-blog/${blog.slug}`}
                        className="flex gap-1 items-center hover:text-blue-400 trasition-all duration-300"
                    >
                        <ArrowLeftOutlined className="w-5 h-5" />
                        <p className="text-lg">Quay lại chỉnh sửa</p>
                    </Link>
                    <div className="bg-background p-10 ql-snow flex flex-col gap-5 ">
                        <div className="flex gap-1 mx-4 mb-2">
                            {blog.categories.length > 0 &&
                                blog.categories.map((category) => {
                                    return (
                                        <p key={category.category_id} className="text-sm font-semibold text-gray-500">
                                            {category.title}
                                        </p>
                                    );
                                })}
                        </div>
                        <p className="text-5xl font-semibold mx-4">{blog.title}</p>
                        <div className="flex gap-2 items-center mx-4">
                            <img
                                src={authorAvatarUrl || Plog}
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
                            <img src={imageUrl} alt="thumbnail" className="" />
                        </div>
                        <div
                            ref={contentRef}
                            className="ql-editor blog-content"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogReview;
