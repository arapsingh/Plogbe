import React, { useEffect, useState } from 'react';
import { Spin, CarouselBlog, BlogCardLong, Pagination } from '../../../components';
import { useAppSelector, useAppDispatch } from '../../../hooks/hooks.ts';
import { blogActions, categoryActions } from '../../../redux/slices';
import { PlogLong } from '../../../assets/images';
import { Link } from 'react-router-dom';

const BlogHome = () => {
    const dispatch = useAppDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const top10Like = useAppSelector((state) => state.blogSlice.top10Like) ?? [];
    const top10View = useAppSelector((state) => state.blogSlice.top10View) ?? [];
    const blogs = useAppSelector((state) => state.blogSlice.blogs) ?? [];
    const totalPage = useAppSelector((state) => state.blogSlice.totalPage) || 0;
    const totalRecord = useAppSelector((state) => state.blogSlice.totalRecord) || 0;
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
    const categories = useAppSelector((state) => state.categorySlice.categories) || [];
    const handleChangePageIndex = (pageIndex) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
    };
    useEffect(() => {
        dispatch(blogActions.top10Like());
        dispatch(blogActions.top10View());
        dispatch(categoryActions.getCategories());
    }, [dispatch]);
    useEffect(() => {
        dispatch(blogActions.getNewestBlogWithPagination(pageIndex));
    }, [pageIndex]);
    return (
        <>
            {isGetLoading && <Spin />}
            <div className="w-full h-fill">
                <img src={PlogLong} alt="" className="w-full h-auto" />
            </div>
            {totalRecord === 0 ? (
                <p className="text-xl ">Không có blog nào</p>
            ) : (
                <div className="container mb-10">
                    <div className="my-10 mx-4">
                        <h2 className="text-xl tablet:text-4xl font-bold mb-3">
                            Đánh giá <span className="text-lightblue"> cao nhất </span>
                        </h2>
                        <span className="w-[60px] h-1 bg-black block"></span>
                        <div className="mt-5">
                            <CarouselBlog blogs={top10Like} />
                        </div>
                    </div>
                    <div className="my-10 mx-4">
                        <h2 className="text-xl tablet:text-4xl font-bold mb-3">
                            Đang <span className="text-lightblue"> phổ biến </span>
                        </h2>
                        <span className="w-[60px] h-1 bg-black block"></span>
                        <div className="mt-5">
                            <CarouselBlog blogs={top10View} />
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-start">
                        <h2 className="text-xl tablet:text-4xl font-bold mb-3">
                            Mới <span className="text-lightblue"> nhất </span>
                        </h2>
                        <span className="w-[60px] h-1 bg-black block"></span>
                        <div className="flex w-full justify-between">
                            <div className="flex flex-col gap-2 w-3/5">
                                {totalRecord > 0 &&
                                    blogs.length > 0 &&
                                    blogs.map((blog) => (
                                        <div className="w-full" key={blog.blog_id}>
                                            <BlogCardLong
                                                key={blog.blog_id}
                                                blog={blog}
                                                author={blog.author}
                                            />
                                        </div>
                                    ))}
                            </div>
                            <div className="flex flex-col w-1/5 h-full relative ">
                                <p className="text-xl font-semibold mb-2">Danh mục</p>
                                <div className="flex flex-wrap w-full h-fit justify-start">
                                    {categories.length > 0 &&
                                        categories.map((category) => {
                                            return (
                                                <Link
                                                    key={category.category_id}
                                                    to={`/blog/category/${category.category_id}`}
                                                    className="border border-gray-500 rounded-[50px] truncate h-10 max-w-[200px] text-xl py-2 px-4 my-2 mx-1 cursor-pointer hover:border-info hover:text-info transition-all duration-300"
                                                >
                                                    {category.title}
                                                </Link>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                        {totalPage > 1 && (
                            <div className="flex justify-end my-4">
                                <Pagination
                                    handleChangePageIndex={handleChangePageIndex}
                                    totalPage={totalPage}
                                    currentPage={pageIndex}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default BlogHome;
