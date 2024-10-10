import { Button, Form, Image, Input, Upload } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { Flex, Layout, Tabs } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, CheckCircleOutlined, PoweroffOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { blogActions, categoryActions } from '../../redux/slices/index.js';
import { editBlogValidationSchema } from '../../validations/blog.js';
import { UploadOutlined } from '@ant-design/icons';
import { convertDateFormat } from '../../utils/helper.js';
import { Select, Space } from 'antd';
import TextEditorWithImage from '../../components/TextEditorWithImage.jsx';
import Spin from '../../components/Spin.jsx';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import axios from 'axios';
const { Sider } = Layout;
const { TabPane } = Tabs;

// const headerStyle = {
//     textAlign: 'center',
//     color: '#fff',
//     height: 64,
//     paddingInline: 48,
//     lineHeight: '64px',
//     backgroundColor: '#4096ff',
// };
// const contentStyle = {
//     textAlign: 'center',
//     minHeight: 120,
//     lineHeight: '120px',
//     color: '#fff',
//     backgroundColor: '#0958d9',
// };
const siderStyle = {
    // height: '100vh',
    backgroundColor: '#D8D8D8',
    padding: '16px',
};
const tabPaneStyle = {
    fontSize: '18px',
};
// const footerStyle = {
//     textAlign: 'center',
//     color: '#fff',
//     backgroundColor: '#4096ff',
// };
// const layoutStyle = {
//     borderRadius: 8,
//     overflow: 'hidden',
//     width: 'calc(50% - 8px)',
//     maxWidth: 'calc(50% - 8px)',
// };
const EditBlog = () => {
    const [activeTabKey, setActiveTabKey] = useState('1');
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const isGetLoading = useAppSelector((state) => state.blogSlice.isGetLoading);
    const isLoading = useAppSelector((state) => state.blogSlice.isLoading);
    const { slug } = useParams();
    const dispatch = useAppDispatch();
    const blog = useAppSelector((state) => state.blogSlice.blog);

    useEffect(() => {
        dispatch(blogActions.getBlogBySlug(slug));
    }, [dispatch, slug]);

    useEffect(() => {
        dispatch(categoryActions.getCategories());
    }, [dispatch, blog.blog_id]);
    const yupSync = {
        async validator({ field }, value) {
            await editBlogValidationSchema.validateSyncAt(field, { [field]: value });
        },
    };
    const [imagePreview, setImagePreview] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const customRequest = async ({ file, onSuccess, onError }) => {
        try {
            await editBlogValidationSchema.validateSyncAt('image_blog', { image_blog: file });
            setSelectedFile(file);
            setImageUrl('');
            const objectUrl = URL.createObjectURL(file);
            console.log('obj:', objectUrl);
            setImagePreview(objectUrl);
            onSuccess();
            return () => URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error(error.message); // In ra lý do xác thực thất bại
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

    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (blog.url_image) {
                    const response = await axios.get(`https://cors-pass.onrender.com/${blog.url_image}`, {
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
    }, [blog.url_image]);
    const categories = useAppSelector((state) => state.categorySlice.categories);
    const blogCategories = useAppSelector((state) => state.blogSlice.blog.categories);

    const [selectedItems, setSelectedItems] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [chosenOptionsCategories, setChosenOptionsCategories] = useState([]);
    const [options, setOptions] = useState([]);
    useEffect(() => {
        // Tạo options từ categories
        const options = categories.map((item) => ({
            label: item.title,
            value: item.category_id,
            desc: item.title,
        }));
        setOptions(options);
        console.log('options:', options);
        // Tạo chosenOptionsCategories từ blogCategories
        const chosenOptionsCategories = blogCategories.map((category) => ({
            value: category.category_id,
            label: category.title,
            desc: category.title,
        }));
        setChosenOptionsCategories(chosenOptionsCategories);
        console.log('chosen option initial:', chosenOptionsCategories);

        // Cập nhật selectedItems từ chosenOptionsCategories
        const newSelectedItems = chosenOptionsCategories.map((category) => category.value);
        setSelectedItems(newSelectedItems);
        // Cập nhật filteredOptions
        const newFilteredOptions = options.filter((option) => !selectedItems.includes(option.value));
        setFilteredOptions(newFilteredOptions);
        console.log(filteredOptions);
        // Cập nhật form nếu blog đã có giá trị
        if (blog) {
            const imageFile = blog.url_image
                ? {
                      url: blog.url_image,
                      type: 'image/jpeg',
                      size: 1024 * 1024,
                  }
                : null;

            form.setFieldsValue({
                title: blog.title,
                image_blog: imageFile,
                categories: chosenOptionsCategories,
                content: blog.content,
            });

            if (blog.url_image) {
                setImagePreview(blog.url_image);
            }
        }
    }, [blog, categories, blogCategories]);

    const handleChangeCategories = (selectedValues) => {
        const selectedItemValues = selectedValues.map((v) => v.value); // Lấy giá trị đã chọn
        setSelectedItems(selectedItemValues);
        // Cập nhật filteredOptions
        const newFilteredOptions = options.filter((option) => !selectedItemValues.includes(option.value));
        setFilteredOptions(newFilteredOptions);
        console.log('Selected Value:', selectedItemValues);
    };
    const [content, setContent] = useState(''); // Lưu trữ nội dung
    const handleChangeContent = (content) => {
        form.setFieldValue('content', content);
        console.log('contnet:', content);
        setContent(content);
    };
    const editorRef = useRef(null);
    const [isSaveVisible, setIsSaveVisible] = useState(false);
    const [isDeleteVisible, setIsDeleteVisible] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(content);

    useEffect(() => {
        const updateImageUrls = async () => {
            if (editorRef.current) {
                const imgElements = editorRef.current.getElementsByTagName('img');

                for (let img of imgElements) {
                    const originalUrl = img.src;

                    // Lưu trữ URL gốc vào thuộc tính data-original-url
                    img.setAttribute('data-original-url', originalUrl);

                    try {
                        const response = await axios.get(`https://cors-pass.onrender.com/${originalUrl}`, {
                            headers: {
                                'x-requested-with': 'XMLHttpRequest',
                            },
                            responseType: 'arraybuffer',
                        });

                        const blob = new Blob([response.data], { type: 'image/png' });
                        const secureImageUrl = URL.createObjectURL(blob);

                        img.src = secureImageUrl; // Cập nhật URL thành blob URL
                    } catch (error) {
                        console.error('Error fetching the image:', error);
                    }
                }
            }
        };

        updateImageUrls();
    }, [blog.content]);
    const onFinish = async (values) => {
        try {
            // Lấy lại các thẻ <img> từ nội dung
            if (editorRef.current) {
                const imgElements = editorRef.current.getElementsByTagName('img');

                for (let img of imgElements) {
                    const blobUrl = img.src;
                    const originalUrl = img.getAttribute('data-original-url');

                    // Nếu ảnh chưa thay đổi, đặt lại URL gốc
                    if (blobUrl.startsWith('blob:')) {
                        img.src = originalUrl;
                    }
                }
            } else {
                toast.error("an error with editorRef");
            }

            // Cập nhật lại nội dung sau khi xử lý ảnh
            setUpdatedContent(editorRef.current.innerHTML);
            // const content = values.content;
            // if (content.length < 1) {
            //     toast.error('Content phải có nội dung');
            //     return;
            // }
            // Regular expression to check for <img> tags
            const hasImage = /<img\s+[^>]*src="([^"]*)"[^>]*>/i.test(updatedContent);
            let contentData;
            if (editorRef.current) {
                if (hasImage) {
                    const result = await editorRef.current.handleSave(blog);
                    if (result.success) {
                        contentData = result.data; // Save content from editor if image exists
                    } else {
                        throw new Error('Lưu nội dung không thành công.');
                    }
                } else {
                    contentData = updatedContent; // Assign directly if no images
                }
            }
            const formData = new FormData();
            if (selectedFile) {
                formData.append('image_blog', selectedFile);
            }
            formData.append('title', values.title);
            formData.append('content', contentData); // Use contentData instead of result.data
            formData.append('blog_id', blog.blog_id);
            formData.append('categories', selectedItems);
            const response = await dispatch(blogActions.updateBlog(formData));
            if (response.payload.status_code === 200) {
                toast.success(response.payload.message);
                navigate('/my-blog');
                setIsSaveVisible(!isSaveVisible);
            } else {
                toast.error(response.payload.message);
            }
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra.');
        }
    };

    const handleChangeStatusClick = () => {
        dispatch(blogActions.changeStatusBlog(slug)).then((response) => {
            if (response.payload.status_code == 200) {
                toast.success(response.payload.message);
                dispatch(blogActions.getBlogBySlug(slug));
            } else toast.error(response.payload.message);
        });
    };
    const handleDeleteBlogClick = () => {
        dispatch(blogActions.deleteBlog(slug)).then((response) => {
            if (response.payload.status_code == 200) {
                toast.success(response.payload.message);
                navigate('/my-blog');
            }
        });
    };
    return (
        <>
            {isGetLoading || (isLoading && <Spin />)}
            <Layout style={{ minHeight: '100vh' }}>
                <Sider style={siderStyle} width={300}>
                    <Link
                        to={`/my-blog`}
                        className="flex gap-1 items-center hover:text-blue-400 trasition-all duration-300"
                    >
                        <ArrowLeftOutlined className="w-5 h-5" />
                        <p className="text-lg ml-10">Danh sách blog</p>
                    </Link>
                    <div className="w-[270px] h-px bg-lightorange mb-4"></div>
                    <p className="text-2xl font-medium text-blue-400 ml-16 mb-5 max-w-[200px] break-words whitespace-normal">
                        {blog.title}
                    </p>
                    <Tabs defaultActiveKey="1" tabPosition="left" onChange={(key) => setActiveTabKey(key)}>
                        <TabPane
                            tab={
                                <span style={tabPaneStyle} className="ml-10">
                                    Chỉnh sửa Blog
                                </span>
                            }
                            key="1"
                        ></TabPane>
                        <TabPane
                            tab={
                                <span style={tabPaneStyle} className="ml-10">
                                    Trạng thái Blog
                                </span>
                            }
                            key="2"
                        >
                            {/* Nội dung trạng thái blog */}
                        </TabPane>
                    </Tabs>
                </Sider>
                <Layout style={{ padding: '24px' }}>
                    {activeTabKey === '1' && (
                        <div className="w-full border min-h-[600px] shadow-md">
                            <div className="flex items-center justify-between">
                                <div className="border-b border-gray">
                                    <p className="text-2xl font-normal p-6">Tổng quan blog</p>{' '}
                                </div>
                                <div className="border-b border-gray">
                                    <p className="text-l font-normal italic p-6">
                                        Lần cập nhật gần nhất: {convertDateFormat(blog.updated_at)}{' '}
                                    </p>{' '}
                                </div>
                            </div>

                            <div className="flex-1 flex-col p-8 laptop:flex laptop:gap-4">
                                <p>
                                    Bạn có thể thực hiện chỉnh sửa nội dung, tiêu đề, thể loại của bài blog. Khi blog đã
                                    hoàn thành, bạn có thể qua tab trạng thái blog để thực hiện thay đổi trạng thái của
                                    blog (công khai hoặc ẩn)
                                </p>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    name="pop-up-add-blog"
                                    initialValues={{
                                        title: blog.title,
                                        // image_blog: blog.url_image,
                                        categories: chosenOptionsCategories,
                                        content: blog.content,
                                    }}
                                    onFinish={onFinish}
                                >
                                    <Form.Item label="Tiêu đề" name="title" rules={[yupSync]}>
                                        <Input.TextArea rows={2} />
                                    </Form.Item>
                                    <Form.Item>
                                        <div className="flex items-center justify-center">
                                            <img
                                                width={400}
                                                height={400}
                                                src={imageUrl ? imageUrl : imagePreview}
                                                // preview={false}
                                                // fallback=""
                                                className="avatar-image"
                                            />
                                        </div>
                                    </Form.Item>
                                    <Form.Item
                                        // label={<span className="text-center">Chọn ảnh bìa cho blog</span>}
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
                                                // onChange={handleOnChange} // Xử lý sự kiện thay đổi
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
                                    <Form.Item label="Danh mục" name="categories" rules={[yupSync]}>
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="Chọn một hoặc nhiều danh mục"
                                            // defaultValue={categories.c}
                                            onChange={handleChangeCategories}
                                            options={filteredOptions}
                                            labelInValue
                                            // optionRender={(option) => <Space>{option.data.desc}</Space>}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Nội dung" name="content" rules={[yupSync]}>
                                        <TextEditorWithImage
                                            ref={editorRef}
                                            height={700}
                                            content={blog.content}
                                            handleChangeContent={(content) => {
                                                handleChangeContent(content);
                                            }}
                                        />
                                    </Form.Item>
                                    <div className="flex items-center justify-center mt-20">
                                        <Form.Item>
                                            <Button
                                                className="bg-lightblue w-[150px] mr-20"
                                                htmlType="submit"
                                                disabled={isLoading}
                                                type="primary"
                                                // onClick={onFinish}
                                            >
                                                {isLoading && <span className="loading loading-spinner"></span>}
                                                {isLoading ? 'Loading...' : 'Lưu'}
                                            </Button>
                                            <Button
                                                className="bg-error w-[150px] "
                                                htmlType="button"
                                                disabled={isLoading}
                                                type="primary"
                                                onClick={() => navigate('/my-blog')}
                                            >
                                                {isLoading && <span className="loading loading-spinner"></span>}
                                                {isLoading ? 'Loading...' : 'Hủy'}
                                            </Button>
                                            <Button
                                                className="bg-lightorange w-[150px] ml-20"
                                                htmlType="button"
                                                disabled={isLoading}
                                                type="primary"
                                                onClick={() => navigate(`${`/my-blog/review/${blog.slug}`}`)}
                                            >
                                                {isLoading && <span className="loading loading-spinner"></span>}
                                                {isLoading ? 'Loading...' : 'Xem trước bài viết'}
                                            </Button>
                                        </Form.Item>
                                    </div>
                                    {/* {isSaveVisible && (
                                        <div>
                                            <ConfirmDialog
                                                visible={isSaveVisible}
                                                title="Xác nhận lưu"
                                                content="Bạn có chắc chắn muốn lưu không?"
                                                handleConfirm={
                                                    onFinish // Call the onFinish function
                                                }
                                                handleCancel={() => setIsSaveVisible(false)}
                                            />
                                        </div>
                                    )} */}
                                </Form>
                            </div>
                        </div>
                    )}
                    {activeTabKey === '2' && (
                        <div className="w-full border min-h-[600px] shadow-md">
                            <div className="border-b border-gray">
                                <p className="text-2xl font-normal p-6">Trạng thái blog</p>
                            </div>
                            <div className="flex-1 flex-col p-8 laptop:flex laptop:gap-4">
                                {/* Nội dung của tab Trạng thái Blog */}
                                <p className="text-xl">
                                    Khi blog đã hoàn thành, tại đây bạn có thể thay đổi trạng thái của blog (Xuất bản
                                    hoặc ẩn)
                                </p>
                                <p className="text-l">Nếu xuất bản, bài viết của bạn sẽ được công khai với mọi người</p>
                                <p className="text-xl">
                                    Trạng thái của blog:{' '}
                                    {blog.is_published ? (
                                        <span className="text-xl font-bold">
                                            Đã xuất bản <CheckCircleOutlined />
                                        </span>
                                    ) : (
                                        <span className="text-xl font-bold">
                                            Chưa xuất bản <PoweroffOutlined />
                                        </span>
                                    )}
                                </p>
                                <Button
                                    className={`w-[150px] mr-20 ${
                                        isLoading
                                            ? 'bg-lightblue' // Nếu đang loading, dùng màu xanh dương
                                            : blog.is_published
                                              ? 'bg-gray-400' // Nếu blog đã được xuất bản, dùng màu xám
                                              : 'bg-green-500' // Nếu blog chưa được xuất bản, dùng màu xanh lá
                                    }`}
                                    htmlType="button"
                                    disabled={isLoading}
                                    type="primary"
                                    onClick={handleChangeStatusClick}
                                >
                                    {isLoading && <span className="loading loading-spinner"></span>}
                                    {!isLoading && blog.is_published && 'Ẩn blog'}
                                    {!isLoading && !blog.is_published && 'Xuất bản'}
                                </Button>
                            </div>
                            <div className="border-b border-gray">
                                <p className="text-2xl font-normal p-6">Xóa blog</p>
                            </div>
                            <div className="flex-1 flex-col p-8 laptop:flex laptop:gap-4">
                                {/* Nội dung của tab Trạng thái Blog */}
                                <p className="text-xl">
                                    Bạn cũng có thể xóa blog tại đây. Đây là hành động{' '}
                                    <span className="text-red-600 text-xl">không thể hoàn tác</span>
                                </p>
                                <Button
                                    className={`w-[150px] mr-20 bg-red-600`}
                                    htmlType="button"
                                    disabled={isLoading}
                                    type="primary"
                                    onClick={() => setIsDeleteVisible(true)}
                                >
                                    {isLoading && <span className="loading loading-spinner"></span>}
                                    {isLoading ? 'Loading' : 'Xóa'}
                                </Button>
                            </div>
                            {isDeleteVisible && (
                                <div>
                                    <ConfirmDialog
                                        visible={isDeleteVisible}
                                        title="Xác nhận xóa"
                                        content="Bạn có chắc chắn muốn Xóa không?"
                                        handleConfirm={handleDeleteBlogClick}
                                        handleCancel={() => setIsDeleteVisible(false)}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </Layout>
            </Layout>
        </>
    );
};
export default EditBlog;
