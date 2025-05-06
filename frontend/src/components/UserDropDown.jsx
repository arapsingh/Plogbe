import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Button } from 'antd';
import { DefaultAvatar } from '../assets/images';
import { useAppDispatch, useAppSelector } from '../hooks/hooks.ts';
import { useNavigate } from 'react-router-dom';
import { userActions } from '../redux/slices';
import { ProfileOutlined, LogoutOutlined, ReadOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types'; // Import PropTypes
import axios from 'axios';
const UserDropDown = ({ avatar }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(userActions.logout());
        localStorage.removeItem('messages');
        navigate('/');
    };
    
    const handleViewProfile = () => {
        dispatch(userActions.getMe());
        navigate('/profile');
    };
    const handleMyBlogClick = () => {
        navigate('/my-blog');
    };
    const handleMyReturnAdminPageClick = () => {
        navigate('/admin');
    };
    const currentUser = useAppSelector((state) => state.userSlice.currentUser);
    // const [imageUrl, setImageUrl] = useState('');
    // useEffect(() => {
    //     const fetchImage = async () => {
    //         try {
    //             if (avatar) {
    //                 const response = await axios.get(`https://cors-pass.onrender.com/${avatar}`, {
    //                     headers: {
    //                         'x-requested-with': 'XMLHttpRequest',
    //                     },
    //                     responseType: 'arraybuffer', // Chỉ định kiểu phản hồi là arraybuffer
    //                 });

    //                 // Tạo một blob từ dữ liệu nhị phân
    //                 const blob = new Blob([response.data], { type: 'image/png' }); // Hoặc loại hình ảnh khác nếu cần
    //                 const imageUrl = URL.createObjectURL(blob); // Tạo URL cho blob

    //                 console.log(imageUrl); // Log URL để kiểm tra
    //                 setImageUrl(imageUrl); // Cập nhật trạng thái với URL hình ảnh
    //             }
    //         } catch (error) {
    //             console.error('Error fetching the image:', error); // Xử lý lỗi
    //         }
    //     };

    //     fetchImage(); // Gọi hàm lấy hình ảnh
    // }, [avatar]);
    // Tạo menu items
    const menu = (
        <Menu className="w-[250px]">
            <Menu.Item key="profile" onClick={handleViewProfile}>
                <div className="flex flex-col gap-3 mb-2 tablet:flex-row">
                    <div className="flex-1/3 flex flex-col">
                        <ProfileOutlined style={{ fontSize: '30px', color: '#08c' }} />
                    </div>
                    <div className="flex-1 flex flex-col text-[18px]">Thông tin cá nhân</div>
                </div>
            </Menu.Item>
            <Menu.Item key="myblog" onClick={handleMyBlogClick}>
                <div className="flex flex-col gap-3 mb-2 tablet:flex-row">
                    <div className="flex-1/3 flex flex-col">
                        <ReadOutlined style={{ fontSize: '30px', color: '#08c' }} />
                    </div>
                    <div className="flex-1 flex flex-col text-[18px]">Blog của tôi</div>
                </div>
            </Menu.Item>
            {currentUser?.is_admin && currentUser?.is_admin !== undefined && (
                <Menu.Item key="myblog" onClick={handleMyReturnAdminPageClick}>
                    <div className="flex flex-col gap-3 mb-2 tablet:flex-row">
                        <div className="flex-1/3 flex flex-col">
                            <ReadOutlined style={{ fontSize: '30px', color: '#08c' }} />
                        </div>
                        <div className="flex-1 flex flex-col text-[18px]">Quản lí cho admin</div>
                    </div>
                </Menu.Item>
            )}
            <Menu.Item key="logout" onClick={handleLogout}>
                <div className="flex flex-col gap-3 mb-2 tablet:flex-row">
                    <div className="flex-1/3 flex flex-col">
                        <LogoutOutlined style={{ fontSize: '30px', color: '#08c' }} />
                    </div>
                    <div className="flex-1 flex flex-col text-[18px]">Đăng xuất</div>
                </div>
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown overlay={menu} trigger={['click']}>
            <Button type="text" className="p-0" style={{ border: 'none', background: 'transparent' }}>
                <img
                    src={avatar || DefaultAvatar}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full cursor-pointer"
                />
            </Button>
        </Dropdown>
    );
};
UserDropDown.propTypes = {
    avatar: PropTypes.any, // `isLogin` là kiểu boolean
};
export default UserDropDown;