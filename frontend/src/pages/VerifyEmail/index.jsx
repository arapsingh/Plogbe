import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { useParams } from 'react-router-dom';
import { userActions } from '../../redux/slices';
import { Navigate, Link } from 'react-router-dom';
import { ClockCircleOutlined, DislikeOutlined, LikeOutlined } from '@ant-design/icons';

const VerifyEmail = () => {
    const isLogin = useAppSelector((state) => state.userSlice.isLogin);

    const dispatch = useAppDispatch();

    const { token } = useParams();

    useEffect(() => {
        dispatch(userActions.verifyEmail(token));
    }, [token, dispatch]);

    const errorMessage = useAppSelector((state) => state.userSlice.error) ?? '';
    const successMessage = useAppSelector((state) => state.userSlice.success) ?? '';

    if (isLogin && successMessage === '') return <Navigate to={'/'} />;

    return (
        <>
            <div className="mt-[100px] h-screen flex items-center justify-center space-x-[1rem]">
                <div className="bg-footer flex items-center w-[700px] h-[350px] justify-center border-sm border-gray-400 rounded-md shadow-md">
                    {errorMessage === '' && successMessage === '' && (
                        <div className="flex flex-col gap-5 items-center justify-center p-5">
                            <ClockCircleOutlined style={{ fontSize: '66px', color: '#08c'}} />
                            <h3 className={`text-3xl text-bold font-Roboto text-switch text-black`}>
                                Vui lòng đợi chúng tôi xác nhận tài khoản của bạn
                            </h3>
                            <h3 className={`text-xl text-bold font-Roboto text-switch`}>
                                Quá trình này sẽ mất vài giây đến vài phút
                            </h3>
                        </div>
                    )}
                    {errorMessage !== '' && (
                        <>
                            <div className="flex flex-col gap-5 items-center justify-center p-5">
                                <DislikeOutlined style={{ fontSize: '66px', color: '#08c'}} className="text-error" />
                                <h3 className={`text-3xl text-bold font-Roboto text-switch text-error`}>
                                    Xảy ra lỗi trong quá trình xác thực
                                </h3>
                                <h3 className={`text-2xl text-bold font-Roboto text-switch text-error`}>
                                    Tên lỗi: {errorMessage}
                                </h3>
                                <Link to={'/'} className="text-xl text-switch font-Roboto underline">
                                    Trở về trang chủ
                                </Link>
                            </div>
                        </>
                    )}
                    {successMessage !== '' && (
                        <>
                            <div className="flex flex-col gap-5 items-center justify-center p-5">
                                <LikeOutlined style={{ fontSize: '66px', color: '#08c'}} className="text-success" />
                                <h3 className={`text-3xl text-bold font-Roboto text-switch text-success`}>
                                    Xác thực thành công
                                </h3>
                                <h3 className={`text-2xl text-bold font-Roboto text-switch text-success`}>
                                    {successMessage}
                                </h3>
                                <Link to={'/login'} className="text-xl text-switch font-Roboto underline">
                                    Đăng nhập
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default VerifyEmail;
