import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts'; // Giữ lại nếu hook này được cấu hình để hoạt động với JavaScript
import { Plog, DefaultAvatar } from '../../assets/images';
import { useNavigate } from 'react-router-dom';
import UserDropDown from '../UserDropDown.jsx';
import PropTypes from 'prop-types'; // Import PropTypes
import { Toaster } from 'react-hot-toast';
import { userActions } from '../../redux/slices/index.js';
import Spin from '../Spin.jsx';
const Header = ({ isLogin }) => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/sign-up');
    };

    const avatar = useAppSelector((state) => state.userSlice.user.url_avatar);
    const isLoading = useAppSelector((state) => state.userSlice.isGetLoading);
    const dispatch = useAppDispatch();
    // const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        dispatch(userActions.getProfile());
    }, [dispatch]);
    return (
        <>
            {isLoading && <Spin />}
            <header className="header flex items-center justify-between p-4 bg-lightorange">
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
                            <button
                                onClick={handleLoginClick}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 "
                            >
                                Đăng nhập
                            </button>
                            <button
                                onClick={handleSignupClick}
                                className="px-4 py-2 bg-white text-blue-500 border border-blue-500 rounded hover:bg-gray-100"
                            >
                                Đăng kí
                            </button>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
};
Header.propTypes = {
    isLogin: PropTypes.bool, // `isLogin` là kiểu boolean
};
export default Header;
