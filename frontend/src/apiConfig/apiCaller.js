import axios from 'axios';
import Cookies from 'js-cookie';
// const constants = require('../constants');
import { userApis } from '../api';
import { io } from 'socket.io-client'; // Import socket.io-client

const axiosPublic = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
});

const axiosInstance = axios.create();
axiosPublic.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config;
        if (error?.response?.status === 401 && !config._retry) {
            config._retry = true;
            const response = await userApis.refreshAccessToken();
            const accessToken = response.data.data.accessToken;
            if (accessToken) {
                Cookies.set('accessToken', accessToken);
                config.headers = {
                    ...config.headers,
                    authorization: `Bearer ${accessToken}`,
                };
                return axiosInstance(config);
            }
        }
        if (error) {
            if (error.response.data.message === 'Vui lòng đăng nhập lại') {
                Cookies.remove('refreshToken');
                Cookies.remove('accessToken');
                window.location.href = '/';
            }
            return Promise.reject(error.response);
        }
        // return error;
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
            // "Origin:": "https://sandbox.vnpayment.vn",
            rftoken: `rfToken ${refreshToken}`,
        },
        url: `/${path}`,
        data,
    });
};

export { apiCaller, apiCallerVnpay };
