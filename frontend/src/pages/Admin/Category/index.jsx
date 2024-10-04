import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import { categoryActions } from '../../../redux/slices/index.js';
import { SearchOutlined } from '@ant-design/icons';

import Spin from '../../../components/Spin';
import { Button, Modal } from 'antd';
import PopupAddCategory from './PopupAddCategory.jsx';
import CategoryCard from './CategoryCard.jsx';
import Pagination from '../../../components/Pagination.jsx';
import PopupEditCategory from './PopupEditCategory.jsx';
import ConfirmDialog from '../../../components/ConfirmDialog.jsx';
import toast from 'react-hot-toast';
const Category = () => {
    const isGetLoading = useAppSelector((state) => state.categorySlice.isGetLoading);
    const categories = useAppSelector((state) => state.categorySlice.categories);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [pageIndex, setPageIndex] = useState(1);
    const [searchItem, setSearchItem] = useState('');
    const totalPage = useAppSelector((state) => state.categorySlice.totalPage);
    const totalRecord = useAppSelector((state) => state.categorySlice.totalRecord);
    const inputRef = useRef(null);
    const dispatch = useAppDispatch();
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
    const handleReset = () => {
        setPageIndex(1);
        setSearchItem('');
        dispatch(categoryActions.getCategoriesWithPagination({ searchItem, pageIndex }));
    };
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleCancelModal = () => {
        setIsDialogOpen(!isDialogOpen);
    };
    const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);
    const handleOpenEditModal = (category) => {
        setSelectedCategory(category); // Lưu category đã chọn vào state
        setIsDialogEditOpen(true);
    };

    const handleCancelEditModal = () => {
        setIsDialogEditOpen(!isDialogEditOpen);
        setSelectedCategory(null);
    };
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const handleDeleteCategoryClick = () => {
        dispatch(categoryActions.deleteCategory(selectedCategory.category_id)).then((response)=> {
            if (response.payload.status_code == 200) {
                toast.success(response.payload.message);
                dispatch(categoryActions.getCategoriesWithPagination({ searchItem: '', pageIndex: 1 }));
            } else toast.error(response.payload.message);
        });
        setIsOpenDeleteModal(false);
    };
    const handleOpenDeleteModal = (category) => {
        setSelectedCategory(category); // Lưu category đã chọn vào state
        setIsOpenDeleteModal(true);
    };
    useEffect(() => {
        dispatch(categoryActions.getCategoriesWithPagination({ pageIndex, searchItem }));
    }, [dispatch, pageIndex, searchItem]);
    return (
        <>
            {isGetLoading && <Spin />}
            <div className="flex flex-col min-h-screen bg-background_2">
                <div className="flex flex-col tablet:flex-row items-center gap-4 p-4">
                    <div className="w-[1000px] ml-48 flex items-center justify-center gap-4">
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
                                <SearchOutlined />
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
                        bodyStyle={{
                            padding: 0,
                            maxHeight: '100vh', // Giới hạn chiều cao của modal
                            overflowY: 'auto', // Thêm thanh trượt dọc
                        }}
                        onCancel={handleCancelModal}
                        centered
                        width={720}
                    >
                        <PopupAddCategory handleCancelButtonClicked={handleCancelModal} />
                    </Modal>
                )}

                {/* Category list */}
                <div className="flex flex-col tablet:flex-row w-full mt-4">
                    <div className="flex-1 w-full p-4">
                        {categories.length === 0 ? (
                            <p className="text-2xl text-error text-center font-bold">
                                Không tìm thấy danh mục{' '}
                                {searchItem && (
                                    <span>
                                        với từ khoá <span className="italic">&quot;{searchItem}&quot;</span>
                                    </span>
                                )}
                            </p>
                        ) : (
                            <p className="text-2xl text-center font-bold">Có {totalRecord} danh mục được tìm thấy </p>
                        )}
                        <div className="flex-1  my-1  w-full px-10 justify-start">
                            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                                {categories.map((category, index) => (
                                    <div className="w-full my-1 max-w-xs tablet:max-w-full" key={index}>
                                        <CategoryCard
                                            category={category}
                                            handleOpenEditModal={() => handleOpenEditModal(category)}
                                            handleOpenDeleteModal={() => handleOpenDeleteModal(category)}
                                        />
                                    </div>
                                ))}
                            </div>
                            {isDialogEditOpen && (
                                <Modal
                                    open={isDialogEditOpen}
                                    footer={null}
                                    width={720} // Đặt chiều rộng modal trực tiếp
                                    bodyStyle={{
                                        padding: 0,
                                        maxHeight: '100vh', // Giới hạn chiều cao của modal
                                        overflowY: 'auto', // Thêm thanh trượt dọc
                                    }}
                                    onCancel={handleCancelEditModal}
                                    centered
                                >
                                    <PopupEditCategory
                                        handleCancelButtonClicked={handleCancelEditModal}
                                        category={selectedCategory}
                                    />
                                </Modal>
                            )}
                            {isOpenDeleteModal && (
                                <div>
                                    <ConfirmDialog
                                        visible={isOpenDeleteModal}
                                        title="Xác nhận xóa"
                                        content="Bạn có chắc chắn muốn Xóa không?"
                                        handleConfirm={handleDeleteCategoryClick}
                                        handleCancel={() => setIsOpenDeleteModal(false)}
                                    />
                                </div>
                            )}
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
export default Category;
