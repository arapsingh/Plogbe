import { useEffect, useRef, useState } from 'react';
import Spin from '../../../components/Spin';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import { SearchOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal, Table } from 'antd';
import PopupAddUser from './PopupAddUser.jsx';
import { userActions } from '../../../redux/slices/index.js';
import { convertDateFormat } from '../../../utils/helper.js';
import toast from 'react-hot-toast';
import Pagination from '../../../components/Pagination.jsx';
import { DefaultAvatar } from '../../../assets/images/index.js';
import PopupEditUser from './PopupEditUser.jsx';
import ConfirmDialog from '../../../components/ConfirmDialog.jsx';
const User = () => {
    const isGetLoading = useAppSelector((state) => state.userSlice.isGetLoading);
    const isLoading = useAppSelector((state) => state.userSlice.isLoading);
    const inputRef = useRef(null);
    const dispatch = useAppDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [searchItem, setSearchItem] = useState('');
    const totalPage = useAppSelector((state) => state.userSlice.totalPage);
    const totalRecord = useAppSelector((state) => state.userSlice.totalRecord);
    const [role, setRole] = useState('All');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // const [dataSource, setDataSource] = useState([]);
    const users = useAppSelector((state) => state.userSlice.users);
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
            setSearchItem(searchValue);
            inputRef.current.value = '';
        }
    };
    const handleReset = () => {
        setPageIndex(1);
        setSearchItem('');
        dispatch(userActions.getAllUsersWithPagination({ searchItem, pageIndex, role }));
    };
    const handleCancelModal = () => {
        setIsDialogOpen(!isDialogOpen);
    };
    useEffect(() => {
        dispatch(userActions.getAllUsersWithPagination({ searchItem, pageIndex, role }))
            .then((response) => {
                if (response?.payload?.status_code === 200) {
                    // Dữ liệu đã có từ API, không cần làm gì thêm ở đây
                } else {
                    toast.error(response.payload.message);
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [dispatch, searchItem, pageIndex, role]);

    const mapUsersToDataSource = (users) => {
        return users.map((user) => ({
            key: user.user_id,
            avatar: user.url_avatar,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.is_admin ? 'Admin' : 'User',
            updated_at: convertDateFormat(user.updated_at), // Hàm chuyển đổi ngày tháng
            status: user.is_delete ? 'Inactive' : 'Active',
        }));
    };

    // Tại nơi bạn sử dụng
    const dataSource = users ? mapUsersToDataSource(users) : [];
    const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);

    const columns = [
        {
            title: 'Ảnh đại diện',
            dataIndex: 'avatar',
            key: 'avatar',
            render: (url) => (
                <img
                    src={url ? url : DefaultAvatar}
                    alt="avatar"
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }} // Bạn có thể điều chỉnh kích thước và kiểu dáng theo ý muốn
                />
            ),
        },
        {
            title: 'Họ',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Tên',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Cập nhật gần nhất',
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                <Dropdown
                    overlay={
                        <Menu>
                            {record.status === 'Active' ? (
                                <>
                                    <Menu.Item
                                        key="edit"
                                        onClick={() => {
                                            setIsDialogEditOpen(true);
                                            setSelectedUser(record);
                                        }}
                                    >
                                        Sửa người dùng
                                    </Menu.Item>
                                    <Menu.Item
                                        key="delete"
                                        onClick={() => {
                                            setIsOpenDeleteModal(true);
                                            setSelectedUser(record);
                                        }}
                                    >
                                        Xóa người dùng
                                    </Menu.Item>
                                </>
                            ) : (
                                <Menu.Item
                                    key="restore"
                                    onClick={() => {
                                        setIsOpenRestoreModal(true);
                                        setSelectedUser(record);
                                    }}
                                >
                                    Khôi phục
                                </Menu.Item>
                            )}
                        </Menu>
                    }
                    trigger={['click']}
                >
                    <MenuOutlined style={{ cursor: 'pointer' }} />
                </Dropdown>
            ),
        },
    ];
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

    const handleDeleteUserClick = () => {
        dispatch(userActions.deleteUser(selectedUser.key)).then((response) => {
            if (response.payload.status_code == 200) {
                toast.success(response.payload.message);
                dispatch(userActions.getAllUsersWithPagination({ searchItem: '', pageIndex: 1, role: 'All' }));
            } else toast.error(response.payload.message);
        });
        setIsOpenDeleteModal(false);
    };
    const [isOpenRestoreModal, setIsOpenRestoreModal] = useState(false);

    const handleRestoreUserClick = () => {
        dispatch(userActions.activeUser(selectedUser.key)).then((response) => {
            if (response.payload.status_code == 200) {
                toast.success(response.payload.message);
                dispatch(userActions.getAllUsersWithPagination({ searchItem: '', pageIndex: 1, role: 'All' }));
            } else toast.error(response.payload.message);
        });
        setIsOpenRestoreModal(false);
    };
    return (
        <>
            {(isGetLoading || isLoading) && <Spin />}
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
                    {isDialogOpen && (
                        <Modal
                            open={isDialogOpen}
                            footer={null}
                            width={540} // Đặt chiều rộng modal trực tiếp
                            bodyStyle={{
                                padding: 0,
                                maxHeight: '100vh', // Giới hạn chiều cao của modal
                                overflowY: 'auto', // Thêm thanh trượt dọc
                            }}
                            onCancel={handleCancelModal}
                            centered
                        >
                            <PopupAddUser handleCancelButtonClicked={() => setIsDialogOpen(false)} />
                        </Modal>
                    )}
                </div>
                {users.length === 0 ? (
                    <p className="text-2xl text-error text-center font-bold">
                        Không tìm thấy người dùng{' '}
                        {searchItem && (
                            <span>
                                với từ khoá <span className="italic">&quot;{searchItem}&quot;</span>
                            </span>
                        )}
                    </p>
                ) : (
                    <p className="text-2xl text-center font-bold">Có {totalRecord} người dùng được tìm thấy </p>
                )}
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false} // Vô hiệu hóa phân trang
                />
                {isDialogEditOpen && (
                    <Modal
                        open={isDialogEditOpen}
                        footer={null}
                        width={540}
                        bodyStyle={{
                            padding: 0,
                            maxHeight: '100vh',
                            overflowY: 'auto',
                        }}
                        onCancel={() => setIsDialogEditOpen(false)}
                        centered
                    >
                        <PopupEditUser
                            handleCancelButtonClicked={() => setIsDialogEditOpen(false)}
                            user={selectedUser} // Truyền người dùng được chọn vào
                        />
                    </Modal>
                )}
                {isOpenDeleteModal && (
                    <div>
                        <ConfirmDialog
                            visible={isOpenDeleteModal}
                            title="Xác nhận xóa"
                            content="Bạn có chắc chắn muốn Xóa không?"
                            handleConfirm={handleDeleteUserClick}
                            handleCancel={() => setIsOpenDeleteModal(false)}
                        />
                    </div>
                )}
                {isOpenRestoreModal && (
                    <div>
                        <ConfirmDialog
                            visible={isOpenRestoreModal}
                            title="Xác nhận khôi phục"
                            content="Bạn có chắc chắn muốn Khôi phục người dùng này không?"
                            handleConfirm={handleRestoreUserClick}
                            handleCancel={() => setIsOpenRestoreModal(false)}
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
        </>
    );
};
export default User;
