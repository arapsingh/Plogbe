import React, { useState, useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { blogActions, categoryActions } from '../../redux/slices/index.js';
import { Pagination, BlogCard } from '../../components/index.js';
import SearchIcon from '../../assets/icons/SearchIcon.jsx';
import Plog from '../../assets/images/index.js';
import Loading from '../Loading/index.jsx';
import { CloseCircleOutlined } from '@ant-design/icons';
import { previewImage } from '../../utils/helper.js';
import { createBlogValidationSchema } from '../../validations/blog.js';
// import useQueryParams from "../../../hooks/useQueryParams";
import toast from 'react-hot-toast';
import slugify from 'slugify';
import { Button, Modal } from 'antd';
import PopUpAddBlogCard from './PopUpAddBlogCard.jsx';

const Blog = () => {
    // const { keyword, category } = useQueryParams();
    // let categoryQuery = category;
    // if (typeof categoryQuery === "string") {
    //     categoryQuery = [Number(category)];
    // } else if (typeof categoryQuery === "object") {
    //     categoryQuery = category.map((cate: string) => Number(cate));
    // } else {
    //     categoryQuery = [];
    // }
    const [categoryChecked, setCategoryChecked] = useState([]);
    // const [userInput, setUserInput] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [searchItem, setSearchItem] = useState('');

    const inputRef = useRef(null);
    const dispatch = useAppDispatch();
    const categoriesList = useAppSelector((state) => state.categorySlice.categories);
    const blogs = useAppSelector((state) => state.blogSlice.blogs);
    const totalPage = useAppSelector((state) => state.blogSlice.totalPage);
    const totalRecord = useAppSelector((state) => state.blogSlice.totalRecord);
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
    const isLoading = useAppSelector((state) => state.blogSlice.isLoading);
    const handleSingleCategoryChange = (event, categoryId) => {
        const { value, checked } = event.target;

        if (checked) {
            setCategoryChecked((pre) => [...pre, categoryId]);
        } else {
            setCategoryChecked((pre) => [...pre.filter((cate) => cate !== Number(value))]);
        }
    };
    const handleChangePageIndex = (pageIndex) => {
        if (pageIndex < 1) {
            setPageIndex(totalPage);
        } else if (pageIndex > totalPage) setPageIndex(1);
        else {
            setPageIndex(pageIndex);
        }
        return;
    };
    const handleKeyWordSearch = () => {
        if (inputRef.current) {
            inputRef.current.focus();
            const searchValue = inputRef.current.value;
            console.log('click,', searchValue);
            setSearchItem(searchValue);
            inputRef.current.value = '';
        }
    };
    const handleFilterBlog = () => {
        setPageIndex(1);
        const query = {
            pageIndex: 1,
            searchItem: searchItem,
            category: categoryChecked,
        };
        dispatch(blogActions.getAllMyBlogs(query));
    };
    const handleReset = () => {
        setPageIndex(1);
        setSearchItem('');
        setCategoryChecked([]);
        dispatch(blogActions.getAllMyBlogs({ searchItem, pageIndex }));
    };
    useEffect(() => {
        dispatch(blogActions.getAllMyBlogs({ searchItem, pageIndex: 1, category: categoryChecked }));
    }, [dispatch, searchItem]);
    useEffect(() => {
        dispatch(blogActions.getAllMyBlogs({ searchItem, pageIndex, category: categoryChecked }));
    }, [dispatch, pageIndex]);
    useEffect(() => {
        dispatch(categoryActions.getCategories());
    }, [dispatch]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleCancelModal = () => {
        setIsDialogOpen(!isDialogOpen);
    };
    return (
        <>
            {isGetLoading && <Loading />}
            <div className="flex flex-col min-h-screen bg-background_2">
                <div className="flex flex-col tablet:flex-row items-center gap-4 p-4">
                    <div className="w-[1000px] ml-96 flex items-center justify-center gap-4">
                        <div className="relative w-full">
                            <input
                                ref={inputRef}
                                type="text"
                                id="search-blog"
                                placeholder="Từ khóa..."
                                className="rounded-full py-3 px-6 w-full border border-gray-300"
                                // value={userInput}
                                // onChange={(e) => setUserInput(e.target.value)} // Cập nhật giá trị khi nhập liệu
                            />
                            <div
                                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                onClick={handleKeyWordSearch}
                            >
                                <SearchIcon />
                            </div>
                        </div>
                        <button onClick={() => handleReset()} className="btn btn-outline text-lg font-medium ml-8">
                            Đặt lại
                        </button>
                    </div>
                    <Button type="primary" onClick={() => setIsDialogOpen(true)} className="flex-shrink-0">
                        Thêm
                    </Button>
                </div>

                {isDialogOpen && (
                    <Modal
                        open={isDialogOpen}
                        footer={null}
                        style={{ padding: 0 }} // Loại bỏ padding xung quanh Modal
                        bodyStyle={{ padding: 0 }}
                        onCancel={handleCancelModal}
                        centered
                    >
                        <PopUpAddBlogCard handleCancelButtonClicked={handleCancelModal} />
                    </Modal>
                )}

                {/* Filter and Blog list */}
                <div className="flex flex-col tablet:flex-row w-full mt-4">
                    <div className="w-full tablet:w-1/4 p-4">
                        <button
                            className="btn btn-info btn-outline text-lg mb-4 hover:text-white"
                            onClick={handleFilterBlog}
                        >
                            Áp dụng
                        </button>
                        <h2 className="text-xl font-bold mb-4">Danh mục</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {categoriesList.length > 0 &&
                                categoriesList.map((category) => (
                                    <div className="flex items-center gap-2 mb-2" key={category.category_id}>
                                        <input
                                            id={category.title}
                                            type="checkbox"
                                            className="checkbox checkbox-info"
                                            name={category.title}
                                            value={category.category_id}
                                            checked={categoryChecked.includes(category.category_id)}
                                            onChange={(event) =>
                                                handleSingleCategoryChange(event, category.category_id)
                                            }
                                        />
                                        <label htmlFor={category.title} className="text-lg">
                                            {category.title}
                                        </label>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="flex-1 w-full p-4">
                        {blogs.length === 0 ? (
                            <p className="text-2xl text-error text-center font-bold">
                                Không tìm thấy blog{' '}
                                {searchItem && (
                                    <span>
                                        với từ khoá <span className="italic">&quot;{searchItem}&quot;</span>
                                    </span>
                                )}
                                {categoryChecked.length > 0 && <span> với các danh mục yêu cầu</span>}
                            </p>
                        ) : (
                            <p className="text-2xl text-center font-bold">Có {totalRecord} blog được tìm thấy </p>
                        )}
                        <div className="flex-1  my-1  w-full px-10 justify-start">
                        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                                {blogs.map((blog, index) => (
                                            <div className="w-full my-1 max-w-xs tablet:max-w-full" key={index}>
                                        <BlogCard
                                            blog={blog}
                                            author={{
                                                first_name: blog.author?.first_name || '',
                                                last_name: blog.author?.last_name || '',
                                                email: blog.author?.email || '',
                                                url_avatar: blog.author?.url_avatar || undefined,
                                                user_id: blog.author?.user_id || undefined,
                                                description: blog.author?.description || '',
                                                is_admin: blog.author?.is_admin || undefined,
                                                is_delete: blog.author?.is_delete || undefined,
                                                created_at: blog.author?.created_at || undefined,
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            {totalPage > 1 && (
                                <div className="flex justify-center mt-4">
                                    <Pagination
                                        handleChangePageIndex={handleChangePageIndex}
                                        totalPage={totalPage}
                                        currentPage={pageIndex}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog;
