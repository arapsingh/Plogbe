const path = require('path');
const configs = require('../configs');

const convertFilePath = (filePath) => {
    const publicPath = filePath.split('public')[1];
    const fullPath = path.join(configs.general.BACKEND_DOMAIN_NAME, publicPath).replace(/\\/g, '//');
    console.log('convert success');
    return fullPath;
};
// const deConvertFilePath = (filePath: string): string => {
//     const publicPath = filePath.split("3001")[1];
//     const fullPath = path.join(process.cwd(), `//public//${publicPath}`);
//     return fullPath;
// };
const deConvertFilePath = (filePath) => {
    try {
        const url = new URL(filePath);
        const publicPath = url.pathname; // Lấy đường dẫn tương đối từ URL
        const fullPath = path.join(process.cwd(), `public${publicPath}`);
        console.log("deconver success");
        return fullPath;
    } catch (error) {
        console.error('Invalid URL:', error);
        return '';
    }
};
// const convertFilePath = (filePath) => {
//     try {
//         // Kiểm tra xem URL có chứa CORS proxy hay không
//         const originalUrl = filePath.includes('cors-pass') ? filePath.split('cors-pass/')[1] : filePath;

//         // Lấy đường dẫn tương đối từ filePath
//         const publicPath = originalUrl.split('public')[1];

//         // Tạo đường dẫn đầy đủ
//         const fullPath = path.join(configs.general.BACKEND_DOMAIN_NAME, publicPath).replace(/\\/g, '/');

//         console.log('convert success');
//         return fullPath;
//     } catch (error) {
//         console.error('Error in convertFilePath:', error);
//         return '';
//     }
// };
// const deConvertFilePath = (filePath) => {
//     try {
//         // Tạo đối tượng URL từ filePath
//         const url = new URL(filePath);

//         // Kiểm tra xem URL có chứa CORS proxy hay không
//         // Nếu có, bạn sẽ cần lấy URL gốc
//         const originalUrl = url.href.includes('cors-pass') ? url.href.split('cors-pass/')[1] : url.href;

//         // Lấy đường dẫn tương đối từ URL gốc
//         const publicPath = new URL(originalUrl).pathname; // Lấy đường dẫn từ URL gốc
//         const fullPath = path.join(process.cwd(), `public${publicPath}`);

//         console.log('deconver success');
//         return fullPath;
//     } catch (error) {
//         console.error('Invalid URL:', error);
//         return '';
//     }
// };
const convert = { convertFilePath, deConvertFilePath };
module.exports = convert;
