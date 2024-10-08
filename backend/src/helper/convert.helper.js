const path = require('path');
const configs = require('../configs');

const convertFilePath = (filePath) => {
    const publicPath = filePath.split('public')[1];
    const fullPath = path.join(configs.general.BACKEND_DOMAIN_NAME, publicPath).replace(/\\/g, '//');
    console.log("convert success");
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
const convert = { convertFilePath, deConvertFilePath };
module.exports = convert;
