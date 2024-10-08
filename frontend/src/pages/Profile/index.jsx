import Form from 'antd/es/form/Form';
import Spin from '../../components/Spin.jsx';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { Button, Input, Image, Upload } from 'antd';
import { updateProfileValidationSchema } from '../../validations/user.js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { userActions } from '../../redux/slices/index.js';
import { useEffect, useState } from 'react';
import { DefaultAvatar } from '../../assets/images/index.js';
import toast from 'react-hot-toast';
import axios from 'axios';

const Profile = () => {
    const isLoading = useAppSelector((state) => state.userSlice.isGetLoading);
    const getProfile = useAppSelector((state) => state.userSlice.user);
    const dispatch = useAppDispatch();
    const onFinish = (values) => {
        // Tải lên avatar nếu có file được chọn
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('avatar', selectedFile);

                // Gọi hàm xử lý upload avatar từ redux slice
                dispatch(userActions.changeAvatar(formData));
                toast.success('Avatar updated successfully!');
                window.location.reload();
            } catch (error) {
                toast.error('Error updating avatar.');
            }
        }
        const data = {
            first_name: values.first_name,
            last_name: values.last_name,
            description: values.description,
        };
        dispatch(userActions.updateProfile(data)).then((response) => {
            if (response.payload && response.payload.status_code === 200) {
                toast.success(response.payload.message);
            } else {
                toast.error('An error occurred.');
            }
        });
    };
    const onFinishFailed = () => {
        return;
    };
    const yupSync = {
        async validator({ field }, value) {
            await updateProfileValidationSchema.validateSyncAt(field, { [field]: value });
        },
    };
    useEffect(() => {
        dispatch(userActions.getProfile());
    }, [dispatch]);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const files = event.target.files;

        // Kiểm tra xem có file được chọn không
        if (files && files.length > 0) {
            const selectedFile = files[0];

            // Kiểm tra kích thước tối đa (ví dụ: 5MB)
            const maxSize = 4 * 1024 * 1024; // 5MB
            if (selectedFile.size > maxSize) {
                toast.error(
                    'Hình ảnh có kích thước quá lớn, vui lòng chọn hình ảnh có kích thước nhỏ hơn hoặc bằng 4MB'
                );
                event.target.value = ''; // Reset input field
                return;
            }

            // Kiểm tra loại file (chỉ chấp nhận các loại ảnh)
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(selectedFile.type)) {
                toast.error('Sai loại file, vui lòng chọn file hợp lệ (JPEG, PNG, GIF).');
                event.target.value = ''; // Reset input field
                return;
            }

            // Lưu trữ file được chọn trong state hoặc tiếp tục xử lý
            setSelectedFile(selectedFile);
        }
    };
    const [imagePreview, setImagePreview] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // Trạng thái để lưu URL hình ảnh

    // Cập nhật URL tạm thời cho ảnh đã chọn
    useEffect(() => {
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setImagePreview(objectUrl);

            // Giải phóng URL khi component bị unmount
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setImagePreview(getProfile?.url_avatar || DefaultAvatar);
        }
    }, [selectedFile, getProfile?.url_avatar]);

    // useEffect để lấy hình ảnh từ API
    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (imagePreview) {
                    const response = await axios.get(`https://cors-pass.onrender.com/${imagePreview}`, {
                        headers: {
                            'x-requested-with': 'XMLHttpRequest',
                        },
                        responseType: 'arraybuffer', // Chỉ định kiểu phản hồi là arraybuffer
                    });

                    // Tạo một blob từ dữ liệu nhị phân
                    const blob = new Blob([response.data], { type: 'image/png' }); // Hoặc loại hình ảnh khác nếu cần
                    const imageUrl = URL.createObjectURL(blob); // Tạo URL cho blob

                    console.log(imageUrl); // Log URL để kiểm tra
                    setImageUrl(imageUrl); // Cập nhật trạng thái với URL hình ảnh
                }
            } catch (error) {
                console.error('Error fetching the image:', error); // Xử lý lỗi
            }
        };

        fetchImage(); // Gọi hàm lấy hình ảnh
    }, [imagePreview]); // Chạy effect khi imagePreview thay đổi
    
    return (
        <>
            {isLoading ? (
                <Spin />
            ) : (
                <div className="container mx-auto">
                    <div className="flex items-center justify-center mt-[100px] py-10">
                        <div className="avatar-display">
                            <img
                                width={400}
                                height={400}
                                src={imageUrl || imagePreview} // Sử dụng URL mặc định nếu avatarUrl không có
                                // preview={false}
                                // fallback="https://via.placeholder.com/200" // Hình ảnh thay thế nếu URL không hợp lệ
                                className="avatar-image" // Thêm lớp CSS vào ảnh
                            />
                            {/* Avatar input */}
                            <label htmlFor="avatar" className="block text-sm mb-1 tablet:text-xl text-center">
                                Chọn ảnh đại diện
                            </label>
                            <input
                                id="avatar"
                                name="avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="px-2 py-1 rounded-lg border-[1px] outline-none"
                            />
                        </div>{' '}
                        <div className="bg-footer m-4 rounded-xl shadow-lg">
                            <Form
                                // form={form}
                                layout="vertical"
                                name="signup"
                                initialValues={{
                                    first_name: getProfile.first_name,
                                    last_name: getProfile.last_name,
                                    description: getProfile.description,
                                    email: getProfile.email,
                                }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <h1 className="font-bold text-[28px] text-center text-lightorange text-title mb-10">
                                    THÔNG TIN CÁ NHÂN
                                </h1>
                                <div className="flex flex-col gap-3 mb-2 tablet:flex-row">
                                    <div className="flex-1 flex flex-col">
                                        <Form.Item label="Họ" name="first_name" rules={[yupSync]}>
                                            <Input />
                                        </Form.Item>
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <Form.Item label="Tên" name="last_name" rules={[yupSync]}>
                                            <Input />
                                        </Form.Item>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <Form.Item label="Email" name="email">
                                        <Input disabled />
                                    </Form.Item>
                                </div>
                                <div className="mb-2">
                                    <Form.Item
                                        label="Mô tả bản thân"
                                        name="description"
                                        rules={[yupSync]}
                                        valuePropName="value"
                                        getValueFromEvent={(content, delta, source, editor) => content} // Lấy nội dung từ editor
                                    >
                                        <ReactQuill theme="snow" className="h-[200px] mb-10" />
                                    </Form.Item>
                                </div>
                                <div className="flex items-center justify-center">
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="w-[200px] bg-success mr-2"
                                            disabled={isLoading}
                                            style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'Arial' }} // Thay đổi font chữ
                                        >
                                            {isLoading && <span className="loading loading-spinner"></span>}
                                            {isLoading ? 'Loading...' : 'Cập nhật'}{' '}
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="button"
                                            className="w-[200px] bg-error"
                                            disabled={isLoading}
                                            style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'Arial' }} // Thay đổi font chữ
                                        >
                                            {isLoading && <span className="loading loading-spinner"></span>}
                                            {isLoading ? 'Loading...' : 'Hủy'}{' '}
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default Profile;
