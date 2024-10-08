import { useAppSelector, useAppDispatch } from '../../hooks/hooks.ts';
import Spin from '../../components/Spin.jsx';
import { Button, Form, Image, Input, Progress, Upload } from 'antd';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { blogActions } from '../../redux/slices/index.js';
import { createBlogValidationSchema } from '../../validations/blog.js';
import { UploadOutlined } from '@ant-design/icons';
const PopUpAddBlogCard = ({ handleCancelButtonClicked }) => {
    const isLoading = useAppSelector((state) => state.blogSlice.isLoading);
    const [selectedFile, setSelectedFile] = useState(null);
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const onFinish = (values) => {
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('image_blog', selectedFile);
                formData.append('title', values.title);
                console.log(values);
                dispatch(blogActions.createBlog(formData)).then((response) => {
                    if (response.payload.status_code == 200) {
                        toast.success(response.payload.message);
                        dispatch(blogActions.getAllMyBlogs({ searchItem: '', pageIndex: 1 }));
                        handleCancelButtonClicked();
                    } else {
                        toast.error(response.payload.message);
                    }
                });
            } catch (error) {
                toast.error('Có lỗi xảy ra khi tạo blog: ', error);
            }
        }
    };
    const onFinishFailed = () => {
        return;
    };
    const [imagePreview, setImagePreview] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const handleOnChange = (info) => {
        if (info.file.status === 'uploading') {
            // Cập nhật tiến trình tải lên
            setUploadProgress(Math.round((info.file.percent / 100) * 100));
        } else if (info.file.status === 'done') {
            setUploadProgress(0); // Reset tiến trình sau khi hoàn thành
        } else if (info.file.status === 'error') {
            // Xử lý lỗi nếu có
            console.error('Tải lên thất bại', info.file);
            setUploadProgress(0);
        }
    };
    const customRequest = async ({ file, onSuccess, onError }) => {
        try {
            await createBlogValidationSchema.validateSyncAt('image_blog', { image_blog: file });
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
            // setUploadError(''); // Clear any existing error
            onSuccess();
            return () => URL.revokeObjectURL(objectUrl);
        } catch (error) {
            // setUploadError(error.message);
            onError(error);
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);
    const yupSync = {
        async validator({ field }, value) {
            await createBlogValidationSchema.validateSyncAt(field, { [field]: value });
        },
    };
    // const [uploadError, setUploadError] = useState('');

    return (
        <>
            {isLoading && <Spin />}
            <div className="container mx-auto">
                <div className="flex items-center justify-center ">
                    <div className="bg-footer border-0 border-black m-4 rounded-xl shadow-lg">
                        <Form
                            form={form}
                            layout="vertical"
                            name="pop-up-add-blog"
                            initialValues={{
                                title: '',
                                image_blog: [],
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="false"
                        >
                            <header>Tạo blog mới</header>
                            <p>Bạn sẽ tạo blog mới ở đây, bắt đầu với tiêu đề và ảnh bìa</p>
                            <Form.Item label="Tiêu đề" name="title" rules={[yupSync]}>
                                <Input.TextArea rows={4} />
                            </Form.Item>
                            <Form.Item>
                                <div className="flex items-center justify-center">
                                    <img
                                        width={400}
                                        height={400}
                                        src={imagePreview}
                                        // preview={false}
                                        // fallback=""
                                        className="avatar-image"
                                    />
                                </div>
                            </Form.Item>
                            <Form.Item
                                label="Chọn ảnh bìa cho blog"
                                name="image_blog"
                                // validateStatus={uploadError ? 'error' : ''}
                                // help={uploadError || ''}
                                rules={[yupSync]}
                                valuePropName="fileList"
                                getValueFromEvent={(e) => {
                                    // Kiểm tra đối tượng sự kiện gốc
                                    const target = e.nativeEvent.target;
                                    if (target && target.files && target.files.length > 0) {
                                        const file = target.files[0];
                                        console.log('File:', file); // In thông tin tệp
                                        return file;
                                    }
                                    return null;
                                }}
                            >
                                

                                <div className="flex items-center justify-center">
                                    <Upload
                                        // name="image_blog"
                                        accept="image/*"
                                        showUploadList={false}
                                        onChange={handleOnChange} // Xử lý sự kiện thay đổi
                                        customRequest={customRequest} // Use customRequest to handle file upload
                                    >
                                        <Button className="flex items-center justify-center">
                                            <UploadOutlined />
                                            Chọn ảnh bìa
                                        </Button>
                                    </Upload>
                                    {uploadProgress > 0 && <Progress percent={uploadProgress} />}
                                </div>
                            </Form.Item>

                            {''}
                            <div className="flex items-center justify-center">
                                <Form.Item>
                                    <Button
                                        className="bg-lightblue w-[150px] mr-20"
                                        htmlType="submit"
                                        disabled={isLoading}
                                        type="primary"
                                    >
                                        {isLoading && <span className="loading loading-spinner"></span>}
                                        {isLoading ? 'Loading...' : 'Lưu'}
                                        {''}
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
                                        {''}
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};
PopUpAddBlogCard.propTypes = {
    handleCancelButtonClicked: PropTypes.func.isRequired, // Xác định prop phải là một hàm và bắt buộc
};
export default PopUpAddBlogCard;
