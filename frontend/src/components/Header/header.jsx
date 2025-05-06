import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/hooks.ts'; // Giữ lại nếu hook này được cấu hình để hoạt động với JavaScript
import { Plog, DefaultAvatar } from '../../assets/images';
import { useNavigate } from 'react-router-dom';
import UserDropDown from '../UserDropDown.jsx';
import PropTypes from 'prop-types'; // Import PropTypes
import { Toaster } from 'react-hot-toast';
import { Button } from 'antd';
const Header = ({ isLogin }) => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/sign-up');
    };

    const avatar = useAppSelector((state) => state.userSlice.user.url_avatar);

    return (
        <header className="header flex items-center justify-between p-4 bg-gray">
            <Toaster />

            {/* Biểu tượng Blog bên trái */}
            <div className="logo flex items-center">
                <Link to="/">
                    <img src={Plog} alt="Blog Icon" className="w-12 h-12" />
                </Link>
                <Link to="/" className="ml-4 text-xl font-bold">
                    Plog
                </Link>
            </div>

            {/* Phần tử bên phải: Avatar hoặc nút đăng nhập */}
            <div className="user-actions flex items-center">
                {isLogin ? (
                    <UserDropDown avatar={avatar} />
                ) : (
                    <div className="auth-buttons flex space-x-4">
                        <Button
                            onClick={handleLoginClick}
                            className="px-4 py-2 bg-blue-500 text-white"
                            shape="round" // Nút có góc bo tròn
                            size="large"
                        >
                            Đăng nhập
                        </Button>
                        <Button
                            onClick={handleSignupClick}
                            type = "primary"
                            className="px-4 py-2 bg-white text-blue-500"
                            shape="round" // Nút có góc bo tròn
                            size="large"
                        >
                            Đăng kí
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
};
Header.propTypes = {
    isLogin: PropTypes.bool, // `isLogin` là kiểu boolean
};
export default Header;