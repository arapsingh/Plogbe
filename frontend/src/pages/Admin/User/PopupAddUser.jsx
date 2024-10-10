import { Button, Checkbox, Form, Image, Input, Upload } from 'antd';
import Spin from '../../../components/Spin';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import { useEffect, useState } from 'react';
import { Plog } from '../../../assets/images';
import { userActions } from '../../../redux/slices';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { createUserValidationSchema } from '../../../validations/user.js';
const PopupAddUser = ({ handleCancelButtonClicked }) => {
    const isGetLoading = useAppSelector((state) => state.categorySlice.isGetLoading);
    const isLoading = useAppSelector((state) => state.categorySlice.isLoading);
    const [checkedValue, setCheckedValue] = useState(false);
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const onFinish = (values) => {
        values.is_admin = checkedValue;
        dispatch(userActions.createNewUser(values)).then((response) => {
            if (response.payload.status_code == 200) {
                toast.success(response.payload.message);
                dispatch(userActions.getAllUsersWithPagination({ searchItem: '', pageIndex: 1, role: 'All' }));
                handleCancelButtonClicked();
            } else toast.error(response.payload.message);
        });
    };
    const onFinishFailed = () => {
        return;
    };
    const yupSync = {
        async validator({ field }, value) {
            await createUserValidationSchema.validateSyncAt(field, { [field]: value });
        },
    };
    return (
        <>
            {isGetLoading && <Spin />}
            <div className="container mx-auto">
                <div className=" ">
                    <div className="bg-footer border-0 border-black m-4 rounded-xl shadow-lg">
                        <Form
                            form={form}
                            // layout="vertical"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            labelAlign="left"
                            name="pop-up-add-user"
                            initialValues={{
                                first_name: '',
                                last_name: '',
                                email: '',
                                password: '',
                                is_admin: false,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="false"
                        >
                            <header>Tạo người dùng mới</header>
                            <p>Bạn sẽ tạo người dùng mới ở đây</p>
                            <Form.Item label="Họ" name="first_name" rules={[yupSync]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Tên" name="last_name" rules={[yupSync]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Email" name="email" rules={[yupSync]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Mật khẩu" name="password" rules={[yupSync]}>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item label="Là admin" name="is_admin" rules={[yupSync]}>
                                <Checkbox onChange={(e) => setCheckedValue(e.target.checked)} />
                            </Form.Item>
                            <div className="flex items-center justify-center">
                                <Form.Item>
                                    <div className="flex space-x-4 justify-center">
                                        <Button
                                            className="bg-lightblue w-[150px] ml-16"
                                            htmlType="submit"
                                            disabled={isLoading}
                                            type="primary"
                                        >
                                            {isLoading && <span className="loading loading-spinner"></span>}
                                            {isLoading ? 'Loading...' : 'Lưu'}
                                        </Button>
                                        <Button
                                            className="bg-error w-[150px]"
                                            htmlType="button"
                                            disabled={isLoading}
                                            type="primary"
                                            onClick={handleCancelButtonClicked}
                                        >
                                            {isLoading && <span className="loading loading-spinner"></span>}
                                            {isLoading ? 'Loading...' : 'Hủy'}
                                        </Button>
                                    </div>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};
PopupAddUser.propTypes = {
    handleCancelButtonClicked: PropTypes.func.isRequired, // Xác định prop phải là một hàm và bắt buộc
};
export default PopupAddUser;