import { useAppSelector, useAppDispatch } from '../../hooks/hooks.ts';
import Spin from '../../components/Spin.jsx';
import { Button, Form, Input } from 'antd';
import { forgotPasswordValidationSchema } from '../../validations/user.js';
import { userActions } from '../../redux/slices/index.js';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
const ForgotPassword = () => {
    const isLoading = useAppSelector((state) => state.userSlice.isLoading);
    const isLogin = useAppSelector((state) => state.isLogin);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const onFinish = (values) => {
        dispatch(userActions.forgotPassword(values)).then((response) => {
            if (response.payload.status_code == 200) {
                toast.success(response.payload.message);
                navigate('/');
            } else toast.error(response.payload.message);
        });
    };
    if (isLogin) return <Navigate to={'/'} />;
    const onFinishFailed = () => {
        return;
    };
    const yupSync = {
        async validator({ field }, value) {
            await forgotPasswordValidationSchema.validateSyncAt(field, { [field]: value });
        },
    };
    return (
        <>
            {isLoading && Spin}
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
                                QUÊN MẬT KHẨU
                            </h1>
                            <div className="mb-2">
                                <Form.Item
                                    label={
                                        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                            Nhập email tài khoản của bạn:
                                        </p>
                                    }
                                    name="email"
                                    rules={[yupSync]}
                                >
                                    <Input placeholder="abc@gmail.com" />
                                </Form.Item>
                            </div>
                            <div className="mb-2">
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-[400px] bg-lightorange"
                                        disabled={isLoading}
                                    >
                                        {isLoading && <span className="loading loading-spinner"></span>}
                                        {isLoading ? 'Loading...' : 'Gửi'}{' '}
                                    </Button>{' '}
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ForgotPassword;
