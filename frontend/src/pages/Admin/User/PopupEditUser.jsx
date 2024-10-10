import { Button, Checkbox, Form, Image, Input, Upload } from 'antd';
import Spin from '../../../components/Spin';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import { useEffect, useState } from 'react';
import { Plog } from '../../../assets/images';
import { userActions } from '../../../redux/slices';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { createUserValidationSchema, editUserValidationSchema } from '../../../validations/user.js';
const PopupEditUser = ({ handleCancelButtonClicked, user }) => {
    const isGetLoading = useAppSelector((state) => state.categorySlice.isGetLoading);
    const isLoading = useAppSelector((state) => state.categorySlice.isLoading);
    // const user = useAppSelector((state) => state.userSlice.user);
    const [checkedValue, setCheckedValue] = useState(user.role === 'Admin'); // Nếu role là 'admin' thì true, ngược lại là false
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log(user);
        const data = {
            id: user.key,
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            is_admin: checkedValue,
        }
        dispatch(userActions.editUser(data)).then((response) => {
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
            await editUserValidationSchema.validateSyncAt(field, { [field]: value });
        },
    };
    // useEffect(() => {
    //     dispatch(userActions.getUserById(user.id)).then((response) => {
    //         return;
    //     })
    // },[dispatch, user.id])
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
                            name="pop-up-edit-user"
                            initialValues={{
                                first_name: user.first_name,
                                last_name: user.last_name,
                                email: user.email,
                                is_admin: user.role=="Admin",
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="false"
                        >
                            <header>Cập nhật người dùng</header>
                            <p>Bạn sẽ cập nhật thông tin người dùng ở đây</p>
                            <Form.Item label="Họ" name="first_name" rules={[yupSync]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Tên" name="last_name" rules={[yupSync]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Email" name="email" rules={[yupSync]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="Là admin" name="is_admin" rules={[yupSync]}>
                                <Checkbox
                                    checked={checkedValue} // Điều khiển giá trị dựa trên checkedValue
                                    onChange={(e) => setCheckedValue(e.target.checked)}
                                />
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
PopupEditUser.propTypes = {
    handleCancelButtonClicked: PropTypes.func.isRequired, // Xác định prop phải là một hàm và bắt buộc
    user: PropTypes.any,
};
export default PopupEditUser;