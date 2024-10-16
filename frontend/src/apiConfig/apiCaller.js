import axios from 'axios';
import Cookies from 'js-cookie';
// const constants = require('../constants');
import { userApis } from '../api';
import { io } from 'socket.io-client'; // Import socket.io-client
// const corsAnywhereUrl = 'https://cors-pass.onrender.com/'; // Use your own CORS Anywhere instance if possible

const axiosPublic = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
});

const axiosInstance = axios.create();
let isRefreshing = false; // Biến toàn cục để theo dõi yêu cầu làm mới token
let subscribers = []; // Danh sách các yêu cầu sẽ được xử lý sau khi làm mới token
const onRefreshed = (accessToken) => {
    subscribers.forEach((callback) => callback(accessToken)); // Gọi lại tất cả các callback
    subscribers = []; // Reset danh sách callback
};

// Hàm thêm subscriber
const addSubscriber = (callback) => {
    subscribers.push(callback); // Thêm callback vào danh sách
};

axiosPublic.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const config = error?.config;
        if (error?.response?.status === 401 && !config._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    // Thêm callback vào danh sách subscribers
                    addSubscriber((accessToken) => {
                        config.headers['Authorization'] = `Bearer ${accessToken}`;
                        resolve(axiosInstance(config)); // Gửi lại yêu cầu sau khi làm mới token
                    });
                });
            }
            config._retry = true; // Đánh dấu yêu cầu này là đã thử lại
            isRefreshing = true; // Đánh dấu rằng token đang được làm mới
            try {
                const response = await userApis.refreshAccessToken();
                const accessToken = response.data.data.accessToken;

                if (accessToken) {
                    console.log('new accessToken:', accessToken);
                    Cookies.set('accessToken', accessToken);

                    // Cập nhật header cho yêu cầu
                    config.headers = {
                        ...config.headers,
                        authorization: `Bearer ${accessToken}`,
                    };

                    // Gọi lại tất cả các subscriber
                    onRefreshed(accessToken);

                    return axiosInstance(config); // Đảm bảo rằng bạn đang trả về kết quả từ yêu cầu này
                }
            } catch (apiError) {
                console.error('Failed to refresh access token:', apiError);
                return Promise.reject(apiError); // Trả về lỗi nếu có vấn đề khi làm mới token
            } finally {
                isRefreshing = false; // Reset lại trạng thái khi hoàn tất
            }
        }

        // Xử lý các lỗi khác
        if (error) {
            if (error.response.data.message === 'Vui lòng đăng nhập lại') {
                Cookies.remove('refreshToken');
                Cookies.remove('accessToken');
                window.location.href = '/';
            }
            return Promise.reject(error.response);
        }
    }
);

axiosPublic.interceptors.request.use(
    async (config) => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            config.headers = {
                ...config.headers,
                authorization: `Bearer ${accessToken}`,
            };
        }

        return config;
    },
    (error) => Promise.reject(error)
);

const apiCaller = (method, path, data) => {
    const refreshToken = Cookies.get('refreshToken');
    return axiosPublic({
        method,
        headers: {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': '*',
            // 'X-Requested-With': 'XMLHttpRequest', // Thêm header này
            rftoken: `rfToken ${refreshToken}`,
        },
        url: `/api/${path}`,
        data,
    });
};
const apiCallerVnpay = (method, path, data) => {
    const refreshToken = Cookies.get('refreshToken');
    return axiosPublic({
        method,
        headers: {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin': '*',
            // 'X-Requested-With': 'XMLHttpRequest', // Thêm header này
            // "Origin:": "https://sandbox.vnpayment.vn",
            rftoken: `rfToken ${refreshToken}`,
        },
        url: `/${path}`,
        data,
    });
};

export { apiCaller, apiCallerVnpay };
