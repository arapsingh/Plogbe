import { Button, Form, Image, Input, Upload } from 'antd';
import Spin from '../../../components/Spin';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks.ts';
import { createCategoryValidationSchema, editCategoryValidationSchema } from '../../../validations/category';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { Plog } from '../../../assets/images';
import { categoryActions } from '../../../redux/slices';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
const PopupEditCategory = ({ handleCancelButtonClicked, category }) => {
    const isGetLoading = useAppSelector((state) => state.categorySlice.isGetLoading);
    const isLoading = useAppSelector((state) => state.categorySlice.isLoading);
    // const category = useAppSelector((state) => state.categorySlice.category);
    const dispatch = useAppDispatch();
    const [imagePreview, setImagePreview] = useState('');
    const [selectedFile, setSelectedFile] = useState([]);
    const yupSync = {
        async validator({ field }, value) {
            await createCategoryValidationSchema.validateSyncAt(field, { [field]: value });
        },
    };
    const [form] = Form.useForm();
    const onFinish = (values) => {
        // if (selectedFile) {
        try {
            const formData = new FormData();
            formData.append('category_id', category.category_id);
            formData.append('category_image', selectedFile);
            formData.append('title', values.title);
            formData.append('description', values.description);
            dispatch(categoryActions.editCategory(formData)).then((response) => {
                if (response.payload.status_code == 200) {
                    toast.success(response.payload.message);
                    dispatch(categoryActions.getCategoriesWithPagination({ searchItem: '', pageIndex: 1 }));
                    handleCancelButtonClicked();
                } else {
                    toast.error(response.payload.message);
                }
            });
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo blog: ', error);
        }
        // }
    };
    const onFinishFailed = () => {
        return;
    };
    const handleOnChange = () => {
        return;
    };
    const customRequest = async ({ file, onSuccess, onError }) => {
        try {
            await editCategoryValidationSchema.validateSyncAt('category_image', { category_image: file });
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
        dispatch(categoryActions.getCategory(category.category_id)).then((response) => {
            if (response.payload.status_code == 200) {
                const imageFile = response.payload.data.url_image
                    ? {
                          url: response.payload.data.url_image,
                          type: 'image/jpeg',
                          size: 1024 * 1024,
                      }
                    : null;

                form.setFieldsValue({
                    // title: response.payload.data.title,
                    category_image: imageFile,
                    // description: response.payload.data.description,
                });
                setImagePreview(response.payload.data.url_image);
            }
        });
    }, [dispatch, category.category_id]);
    return (
        <>
            {isGetLoading && <Spin />}
            <div className="container mx-auto">
                <div className="">
                    <div className="bg-footer border-0 border-black m-4 rounded-xl shadow-lg">
                        <Form
                            form={form}
                            layout="vertical"
                            name="pop-up-edit-category"
                            initialValues={{
                                title: category.title,
                                category_image: null,
                                description: category.description,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="false"
                        >
                            <header>Tạo danh mục mới</header>
                            <p>Bạn sẽ tạo danh mục mới ở đây</p>
                            <Form.Item label="Tiêu đề" name="title" rules={[yupSync]}>
                                <Input.TextArea rows={2} />
                            </Form.Item>
                            <Form.Item>
                                <div className="flex items-center justify-center">
                                    <Image
                                        width={150}
                                        height={150}
                                        src={imagePreview ? imagePreview : Plog}
                                        preview={false}
                                        fallback=""
                                        // className="avatar-image"
                                    />
                                </div>
                            </Form.Item>
                            <Form.Item
                                label="Chọn ảnh bìa cho danh mục"
                                name="category_image"
                                rules={[yupSync]} // Kiểm tra selectedItem
                                valuePropName="fileList"
                                getValueFromEvent={(e) => {
                                    const target = e.nativeEvent.target;
                                    if (target && target.files && target.files.length > 0) {
                                        const file = target.files[0];
                                        setSelectedFile(file);
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
                                    {/* {uploadProgress > 0 && <Progress percent={uploadProgress} />} */}
                                </div>
                            </Form.Item>
                            <Form.Item
                                label="Mô tả danh mục"
                                name="description"
                                rules={[yupSync]}
                                // valuePropName="value"
                                getValueFromEvent={(content, delta, source, editor) => content} // Lấy nội dung từ editor
                            >
                                <ReactQuill theme="snow" className="h-[200px] mb-10" />
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
PopupEditCategory.propTypes = {
    handleCancelButtonClicked: PropTypes.func.isRequired, // Xác định prop phải là một hàm và bắt buộc
    category: PropTypes.any,
};
export default PopupEditCategory;
