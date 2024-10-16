import * as Yup from "yup";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
export const createCategoryValidationSchema = Yup.object({
    category_image: Yup.mixed()
        .nullable()
        .required("Thumnail là bắt buộc")
        .test("fileFormat", 'Loại hình ảnh không đúng, chỉ chấp nhận JPG JPEG PNG', (value: any) => {
            return value && SUPPORTED_FORMATS.includes(value.type);
        })
        .test("fileSize",'Hình ảnh quá lớn, tối đa là 4 MB', (value: any) => {
            return value && value.size <= 1024 * 1024 * 4;
        }),
    title: Yup.string().trim().required('Phải nhập tiêu đề').max(50, 'Tiêu đề tối đa 50 kí tự'),
    description: Yup.string()
        .trim()
        .required('Mô tả là bắt buộc')
        .max(800, 'Mô tả tối đa 800 kí tự'),
});
export const editCategoryValidationSchema = Yup.object({
    category_image: Yup.mixed()
        .nullable()
        .required("Thumnail là bắt buộc")
        .test("fileFormat", 'Loại hình ảnh không đúng, chỉ chấp nhận JPG JPEG PNG', (value: any) => {
            return value && SUPPORTED_FORMATS.includes(value.type);
        })
        .test("fileSize",'Hình ảnh quá lớn, tối đa là 4 MB', (value: any) => {
            return value && value.size <= 1024 * 1024 * 4;
        }),
    title: Yup.string().trim().required('Phải nhập tiêu đề').max(50,'Tiêu đề tối đa 50 kí tự'),
    description: Yup.string()
        .trim()
        .required('Mô tả là bắt buộc')
        .max(800, 'Mô tả tối đa 800 kí tự'),
});
