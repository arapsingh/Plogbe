import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { signupValidationSchema } from '../../validations/user';
import { userActions } from '../../redux/slices';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { useNavigate, Navigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import Spin from '../../components/Spin.jsx';
const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const onFinish = (values) => {
        dispatch(userActions.signup(values)).then((response) => {
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                navigate('/');
            } else {
                toast.error(response.payload.message);
            }
        });
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const yupSync = {
        async validator({ field }, value) {
            await signupValidationSchema.validateSyncAt(field, { [field]: value });
        },
    };

    const isLogin = useAppSelector((state) => state.userSlice.isLogin);
    const isLoading = useAppSelector((state) => state.userSlice.isLoading);
    if (isLogin) return <Navigate to={'/'} />;
    const [form] = Form.useForm();
    // const handleOnClickSignup = (values) => {
    //     dispatch(userActions.signup(values)).then((response) => {
    //         if (response.payload.status_code === 200) {
    //             toast.success(response.payload.message);
    //             navigate('/');
    //         } else {
    //             toast.error(response.payload.message);
    //         }
    //     });
    // };
    const onChangePassword = (e) => {
        console.log('Password Value:', e.target.value); // Kiểm tra giá trị khi người dùng nhập
        form.setFieldsValue({ password: e.target.value });
    };

    return (
        <>
            {isLoading && <Spin />}
            <div className="container mx-auto">
                <div className="flex items-center justify-center mt-[100px] py-10">
                    <div className="bg-footer m-4 rounded-xl shadow-lg">
                        <Form
                            form={form}
                            layout="vertical"
                            name="signup"
                            initialValues={{
                                email: '',
                                password: '',
                                confirm_password: '',
                                first_name: '',
                                last_name: '',
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <h1 className="font-bold text-[28px] text-center text-lightorange text-title mb-10">
                                ĐĂNG KÝ
                            </h1>
                            <div className="flex flex-col gap-3 mb-2 tablet:flex-row">
                                <div className="flex-1 flex flex-col">
                                    <Form.Item label="Tên" name="last_name" rules={[yupSync]}>
                                        <Input />
                                    </Form.Item>
                                </div>

                                <div className="flex-1 flex flex-col">
                                    <Form.Item label="Họ" name="first_name" rules={[yupSync]}>
                                        <Input />
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="mb-2">
                                <Form.Item label="Email" name="email" rules={[yupSync]}>
                                    <Input />
                                </Form.Item>
                            </div>
                            <div className="mb-2">
                                <Form.Item
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[yupSync]}
                                    onChange={onChangePassword}
                                >
                                    <Input.Password
                                        onChange={() => {
                                            // Kiểm tra lại trường "confirm_password" mỗi khi mật khẩu mới thay đổi
                                            form.validateFields(['confirm_password']);
                                        }}/>
                                </Form.Item>
                            </div>
                            <div className="mb-10">
                                <Form.Item
                                    label="Xác nhận mật khẩu"
                                    name="confirm_password"
                                    rules={[
                                        yupSync,
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Mật khẩu xác nhận không trùng khớp'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </div>
                            <div className="flex items-center justify-center">
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-[400px] bg-lightorange"
                                        disabled={isLoading}
                                    >
                                        {isLoading && <span className="loading loading-spinner"></span>}
                                        {isLoading ? 'Loading...' : 'Đăng kí'}{' '}
                                    </Button>
                                </Form.Item>
                            </div>
                            <div className="text-center space-y-[8px]">
                                <p className="block mt-3 mb-2 text-center text-lg">
                                    Bạn đã có tài khoản?
                                    <span className="font-medium hover:opacity-80">
                                        <Link to={'/login'}> Quay lại đăng nhập</Link>
                                    </span>
                                </p>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};
export default SignUp;
