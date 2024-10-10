import React from 'react';
const { useRef } = React;
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Formik, ErrorMessage, Field, Form } from 'formik';
import { loginValidationSchema } from '../../validations/user.js';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { userActions } from '../../redux/slices';
// const constants = require('../../constants');
import Spin from '../../components/Spin';
// const Skeleton = require('@src/assets').Skeleton; // Uncomment and update if needed
import toast from 'react-hot-toast';
import { io } from 'socket.io-client'; // Import socket.io-client

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isLogin = useAppSelector((state) => state.userSlice.isLogin);
    const isAdmin = useAppSelector((state) => state.userSlice.currentUser.is_admin);
    const isLoading = useAppSelector((state) => state.userSlice.isLoading);

    const formikRef = useRef(null);

    if (isLogin) {
        if (isAdmin) return <Navigate to="/admin" />;
        else return <Navigate to="/" />;
    }

    const initialValue = {
        email: '',
        password: '',
    };

    const handleOnSubmit = (values) => {
        dispatch(userActions.setEmail(values.email));
        dispatch(userActions.login(values)).then((response) => {
            console.log('response:', response);

            if (response.payload.status_code === 200) {
                if (response.payload.message === 'Kiếm tra email của bạn để xác minh tài khoản') {
                    navigate('/check-mail');
                } else {
                    toast.success(response.payload.message);
                    console.log(response.payload.message);
                    dispatch(userActions.getMe()).then((meResponse) => {
                        if (meResponse) {
                            const userId = meResponse.user_id;

                            // Kết nối đến server socket
                            const socket = io.connect(process.env.REACT_APP_API_URL || 'http://localhost:3001');

                            // Phát sự kiện xác thực
                            socket.emit('authenticate', userId);

                            // Lắng nghe sự kiện xác thực thành công
                            socket.on('authenticated', (data) => {
                                console.log(data.message); // In ra thông báo thành công
                                toast.success(data.message); // Hiển thị thông báo thành công
                            });

                            // Lắng nghe sự kiện xác thực thất bại
                            socket.on('authentication-failed', (data) => {
                                console.error(data.message);
                                toast.error(data.message); // Hiển thị thông báo lỗi nếu cần
                            });
                        }
                    });
                }
            } else {
                toast.error(response.payload.message);
            }
        });
    };

    return (
        <>
            {isLoading && <Spin />}
            <div className="container mx-auto">
                <div className="flex items-center justify-center mt-[100px] py-10">
                    <div className="bg-footer border-0 border-black m-4 rounded-xl shadow-lg">
                        <Formik
                            initialValues={initialValue}
                            validationSchema={loginValidationSchema}
                            onSubmit={handleOnSubmit}
                            innerRef={formikRef}
                        >
                            {(formik) => (
                                <Form className="p-4" onSubmit={formik.handleSubmit}>
                                    <h1 className="font-bold text-[32px] text-lightorange font-Roboto text-center text-title">
                                        Đăng nhập
                                    </h1>

                                    <div className="flex flex-col mb-3">
                                        <label htmlFor="email" className="text-sm mb-1 tablet:text-xl">
                                            Email
                                        </label>
                                        <Field
                                            id="email"
                                            name="email"
                                            type="text"
                                            autoComplete="true"
                                            className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                formik.errors.email && formik.touched.email ? 'border-error' : ''
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>
                                    <div className="flex flex-col mb-3">
                                        <label htmlFor="password" className="text-sm mb-1 tablet:text-xl">
                                            Mật khẩu
                                        </label>
                                        <Field
                                            id="password"
                                            name="password"
                                            type="password"
                                            className={`px-2 py-4 rounded-lg border-[1px] outline-none max-w-sm ${
                                                formik.errors.password && formik.touched.password ? 'border-error' : ''
                                            }`}
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="span"
                                            className="text-[14px] text-error font-medium"
                                        />
                                    </div>

                                    <button
                                        className="text-white btn w-full text-lg bg-lightorange"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading && <span className="loading loading-spinner"></span>}
                                        {isLoading ? 'Loading...' : 'Đăng nhập'}
                                    </button>
                                    <p className="block mt-3 mb-2 text-center text-lg">
                                        Bạn chưa có tài khoản?{' '}
                                        <span className="font-medium hover:opacity-80">
                                            <Link to="/sign-up">Đăng ký</Link>
                                        </span>
                                    </p>
                                    <span className="block mt-3 mb-2 text-center font-medium text-lg hover:opacity-80">
                                        <Link to="/forgot-password">Quên mật khẩu?</Link>
                                    </span>
                                </Form>
                            )}
                        </Formik>
                    </div>
                    <div className="hidden tablet:block transition ease-in-out hover:scale-110 duration-200">
                        {/* <img src={Skeleton} alt="Freshemy" /> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;