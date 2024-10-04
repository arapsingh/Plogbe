import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import Spin from '../../components/Spin';
import { Button, Form } from 'antd';
import {MailOutlined} from '@ant-design/icons';
import { userActions } from '../../redux/slices';
import toast from 'react-hot-toast';
const CheckMail = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isLoading = useAppSelector((state) => state.userSlice.isLoading);
    const email = useAppSelector((state) => state.userSlice.currentUser.email);
    const [form] = Form.useForm();
    const onFinish = () => {
        dispatch(userActions.resendVerifyEmail(email)).then((response) => {
            if (response.payload?.status_code === 200) toast.success(response.payload.message);
        });
    };
    const onFinishFailed = () => {
        return;
    };
    return (
        <>
            {isLoading && <Spin />}
            <div className="container mx-auto">
                <div className="flex items-center justify-center mt-[100px] py-10">
                    <div className="bg-footer m-4 rounded-xl shadow-lg">
                        <Form form={form} name="check-mail" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                            <div className="text-center space-y-[8px]">
                                <MailOutlined style={{ fontSize: '66px', color: '#08c' }} />
                                <p className="block mt-3 mb-2 text-center text-lg">
                                    Tài khoản của bạn chưa được xác thực
                                </p>
                            </div>
                            <div className="text-center space-y-[8px]">
                                <p className="block mt-3 mb-2 text-center text-lg">
                                    Vui lòng kiểm tra mail để xác thực tài khoản
                                </p>
                            </div>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-[400px] bg-lightorange"
                                    disabled={isLoading}
                                >
                                    {isLoading && <span className="loading loading-spinner"></span>}
                                    {isLoading ? 'Loading...' : 'Gửi lại mail xác nhận'}{' '}
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="button"
                                    className="w-[400px] bg-lightorange"
                                    onClick={() => navigate('/')} // Ví dụ: điều hướng về trang chủ
                                    disabled={isLoading}                                >
                                    {isLoading && <span className="loading loading-spinner"></span>}
                                    {isLoading ? 'Loading...' : 'Trở về trang chủ'}{' '}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};
export default CheckMail;
