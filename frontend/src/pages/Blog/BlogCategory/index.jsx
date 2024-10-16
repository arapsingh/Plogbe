import React, { useEffect, useState } from 'react';
import { Spin, BlogCardLong, Pagination } from '../../../components';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks.ts';
import { useParams, useNavigate } from 'react-router-dom';
import { blogActions, categoryActions } from '../../../redux/slices';

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
    const blogs = useAppSelector((state) => state.blogSlice.relatedBlogs) || [];
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
    //
    return (
        <>
            {isGetLoading && <Spin />}
            <div className="w-full h-[600px] bg-gray-200 flex -translate-y-[30px] ">
                <div className="w-1/2 h-full relative">
                    <div className="absolute top-1/4 left-1/4 w-2/3">
                        <p className="text-5xl font-semibold line-clamp-2">{category.title}</p>
                        {/* <p className="line-clamp-4 text-xl">{category.description}</p> */}
                        <span
                            className="line-clamp-8 text-xl"
                            dangerouslySetInnerHTML={{ __html: category.description }}
                        ></span>
                    </div>
                </div>
                <div className="w-0 hidden tablet:flex tablet:w-1/2 h-full items-center justify-center">
                    <img src={category.url_image} alt={category.title} className="w-auto h-[220px]" />
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
