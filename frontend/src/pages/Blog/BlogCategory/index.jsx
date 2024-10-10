import React, { useEffect, useState } from 'react';
import { Spin, BlogCardLong, Pagination } from '../../../components';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks.ts';
import { useParams, useNavigate } from 'react-router-dom';
import { blogActions, categoryActions } from '../../../redux/slices';
import axios from 'axios';
const BlogCategory = () => {
    const { category_id } = useParams();
    const cateId = Number(category_id);
    const [pageIndex, setPageIndex] = useState(1);
    const handleChangePageIndex = (pageIndex) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
    };
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
    const blogs = useAppSelector((state) => state.blogSlice.blogs) || [];
    const totalPage = useAppSelector((state) => state.blogSlice.totalPage) || 0;
    const totalRecord = useAppSelector((state) => state.blogSlice.totalRecord) || 0;
    const category = useAppSelector((state) => state.categorySlice.category) || {};
    useEffect(() => {
        dispatch(categoryActions.getCategory(cateId)).then((res) => {
            if (res.payload && res.payload.status_code !== 200) {
                navigate('/404');
            }
        });
        dispatch(blogActions.getAllPagingBlog({ pageIndex, category: [cateId], searchItem: '' }));
    }, [dispatch, pageIndex, cateId]);
    // for http
    const [imageUrl, setImageUrl] = useState('');
    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (category.url_image) {
                    const response = await axios.get(`https://cors-pass.onrender.com/${category.url_image}`, {
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
    }, [category.url_image]);
    return (
        <>
            {isGetLoading && <Spin />}
            <div className="w-full h-[400px] bg-gray-200 flex -translate-y-[30px] ">
                <div className="w-1/2 h-full relative">
                    <div className="absolute top-1/4 left-1/4 w-2/3">
                        <p className="text-5xl font-semibold line-clamp-2">{category.title}</p>
                        <p className="line-clamp-4 text-xl">{category.description}</p>
                    </div>
                </div>
                <div className="w-0 hidden tablet:flex tablet:w-1/2 h-full items-center justify-center">
                    <img src={imageUrl} alt={category.title} className="w-auto h-[220px]" />
                </div>
            </div>
            <div className="container mb-10 items-center flex flex-col min-h-[600px]">
                {totalRecord === 0 && <p>Không có bài viết nào thuộc danh mục này</p>}
                <div className="w-3/4 mb-5">
                    {totalRecord > 0 &&
                        blogs.length > 0 &&
                        blogs.map((blog) => {
                            return (
                                <div key={blog.blog_id}>
                                    <BlogCardLong blog={blog} author={blog.author} />
                                </div>
                            );
                        })}
                </div>
                {totalPage > 1 && (
                    <div className="flex my-4">
                        <Pagination
                            handleChangePageIndex={handleChangePageIndex}
                            totalPage={totalPage}
                            currentPage={pageIndex}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default BlogCategory;
