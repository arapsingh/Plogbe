import React, { useEffect, useState } from "react";
import { Spin, BlogCardLong, Pagination } from "../../../components";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks.ts";
// import { useNavigate } from "react-router-dom";
import useQueryParams from "../../../hooks/useQueryParams";
import { blogActions } from "../../../redux/slices";

const BlogSearch: React.FC = () => {
    const { keyword } = useQueryParams();
    const [pageIndex, setPageIndex] = useState(1);
    const handleChangePageIndex = (pageIndex: number) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
    };
    const dispatch = useAppDispatch();
    // const navigate = useNavigate();
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
    const blogs = useAppSelector((state) => state.blogSlice.blogs) || [];
    const totalPage = useAppSelector((state) => state.blogSlice.totalPage) || 0;
    const totalRecord = useAppSelector((state) => state.blogSlice.totalRecord) || 0;
    useEffect(() => {
        // if (!keyword) navigate("/404");
        dispatch(blogActions.searchBlogUserWithPagination({ pageIndex, searchItem: keyword }));
    }, [dispatch, pageIndex]);
    useEffect(() => {
        // if (!keyword) navigate("/404");
        dispatch(blogActions.searchBlogUserWithPagination({ pageIndex: 1, searchItem: keyword }));
    }, [dispatch, keyword]);
    return (
        <>
            {isGetLoading && <Spin />}
            <div className="w-full h-[300px] bg-gray-200 items-center justify-center flex -translate-y-[30px] ">
                <div className="w-2/3 ">
                    <p className="text-5xl font-semibold line-clamp-2">
                        Kết quả tìm kiếm: <span className="italic">&quot;{keyword}&quot;</span>
                    </p>
                </div>
            </div>
            <div className="container mb-10 items-center flex flex-col min-h-[600px]">
                {totalRecord === 0 && <p>Không có bài viết nào được tìm thấy</p>}
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

export default BlogSearch;
