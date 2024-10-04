import * as Yup from 'yup';

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
export const createBlogValidationSchema = Yup.object({
    image_blog: Yup.mixed()
        .nullable()
        .required('Thumbnail là bắt buộc')
        .test('fileFormat', 'Loại hình ảnh không đúng, chỉ chấp nhận JPG JPEG PNG', (value) => {
            return value && SUPPORTED_FORMATS.includes(value.type);
        })
        .test('fileSize', 'Hình ảnh quá lớn, tối đa là 4 MB', (value) => {
            return value && value.size <= 1024 * 1024 * 4;
        }),

    title: Yup.string()
        .trim()
        .required('Phải nhập tiêu đề')
        .max(300, 'Tiêu đề phải dưới 300 ký tự')
        .min(10, 'Tiêu đề phải trên 10 kí tự'),
});
export const editBlogValidationSchema = Yup.object({
    image_blog: Yup.mixed()
        .nullable()
        .required('Thumbnail là bắt buộc')
        .test('fileFormat', 'Loại hình ảnh không đúng, chỉ chấp nhận JPG JPEG PNG', (value) => {
            return value && SUPPORTED_FORMATS.includes(value.type);
        })
        .test('fileSize', 'Hình ảnh quá lớn, tối đa là 4 MB', (value) => {
            return value && value.size <= 1024 * 1024 * 4;
        }),
    categories: Yup.array().min(1, 'Phải có ít nhất 1 danh mục').max(4, 'Tối đa là 4 danh mục'),
    title: Yup.string()
        .trim()
        .required('Phải nhập tiêu đề')
        .min(10, 'Tiêu đề phải lớn hơn 10 kí tự')
        .max(300, 'Tiêu đề phải dưới 300 ký tự'),
    content: Yup.string().trim(),
});
export const createCommentBlogValidationSchema = Yup.object({
    blog_id: Yup.number().required('Mã blog là bắt buộc'),
    content: Yup.string()
        .trim()
        .required('Phải có nội dung')
        .max(5000, 'Bình luận phải dưới 5000 ký tự')
        .test('not-empty', 'Phải có nội dung', (value) => {
            // Kiểm tra nếu content chỉ chứa các thẻ HTML trống
            const isEmptyContent = value && /^\s*<p>\s*<br>\s*<\/p>\s*$/.test(value);
            return !isEmptyContent; // Trả về false nếu là nội dung trống
        }),
    parent_id: Yup.number().nullable(), // Cho phép parent_id là null hoặc không có
});
export const updateCommentBlogValidationSchema = Yup.object({
    comment_id: Yup.number().required('Mã comment là bắt buộc'),
    content: Yup.string()
        .trim()
        .required('Phải có nội dung')
        .max(5000, 'Bình luận phải dưới 5000 ký tự')
        .test('not-empty', 'Phải có nội dung', (value) => {
            // Kiểm tra nếu content chỉ chứa các thẻ HTML trống
            const isEmptyContent = value && /^\s*<p>\s*<br>\s*<\/p>\s*$/.test(value);
            return !isEmptyContent; // Trả về false nếu là nội dung trống
        }),
    // parent_id: Yup.number().nullable(), // Cho phép parent_id là null hoặc không có
});