import { Navigate, useParams, useNavigate } from 'react-router-dom';
import Spin from '../../components/Spin.jsx';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { resetPasswordValidationSchema } from '../../validations/user.js';
import { Button, Form, Input } from 'antd';
import { React, useEffect } from 'react';
import { userActions } from '../../redux/slices';
import toast from 'react-hot-toast';

const ResetPassword = () => {
    const isLoading = useAppSelector((state) => state.userSlice.isLoading);
    const isLogin = useAppSelector((state) => state.userSlice.isLogin);
    const dispatch = useAppDispatch();
    if (isLogin) return <Navigate to="/" />;
    const navigate = useNavigate();

    const onFinishFailed = () => {
        return;
    };

    const yupSync = {
        async validator({ field }, value) {
            await resetPasswordValidationSchema.validateSyncAt(field, { [field]: value });
        },
    };
    const { token } = useParams();
    if (token === undefined) {
        navigate('/');
    }
    const onFinish = (values) => {
        const data = {
            ...values,
            token: token,
        };

        dispatch(userActions.resetPassword(data)).then((response) => {
            if (response.payload.status_code == 200) {
                toast.success(response.payload.message);
                navigate('/login');
            } else toast.error(response.payload.message);
        });
    };

    const [form] = Form.useForm();
    const handleCancelButton = () => {
        navigate('/');
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
                            name="check-password"
                            initialValues={{
                                email: '',
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <h1 className="font-bold text-[28px] text-center text-lightorange text-title mb-10">
                                ĐẶT LẠI MẬT KHẨU
                            </h1>
                            <div className="mb-2">
                                <Form.Item
                                    name="new_password"
                                    label={<p className="text-xl">Nhập mật khẩu mới:</p>}
                                    rules={[yupSync]}
                                >
                                    <Input.Password
                                        onChange={() => {
                                            // Kiểm tra lại trường "confirm_password" mỗi khi mật khẩu mới thay đổi
                                            form.validateFields(['confirm_password']);
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="confirm_password"
                                    label={<p className="text-xl">Xác nhận mật khẩu mới:</p>}
                                    rules={[
                                        yupSync,
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('new_password') === value) {
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
                                <div className="mb-2">
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="w-[150px] mr-2"
                                            disabled={isLoading}
                                        >
                                            {isLoading && <span className="loading loading-spinner"></span>}
                                            {isLoading ? 'Gửi yêu cầu' : 'Đổi mật khẩu'}
                                        </Button>
                                    </Form.Item>
                                </div>
                                <div className="mb-2">
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="button"
                                            className="w-[150px] bg-error"
                                            disabled={isLoading}
                                            onClick={handleCancelButton}
                                        >
                                            {isLoading && <span className="loading loading-spinner"></span>}
                                            {isLoading ? 'Hủy' : 'Hủy'}
                                        </Button>
                                    </Form.Item>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;
