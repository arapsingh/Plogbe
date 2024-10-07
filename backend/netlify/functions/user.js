// backend/netlify/functions/user.js
const express = require('express');
const { handler } = require('@netlify/functions');
const categoryRouter = require('../../dist/src/routes/category.routes.js'); // Import blog router

const app = express();
app.use(express.json());

// Sử dụng blogRouter cho tất cả các route liên quan đến blog
app.use('/api/category', categoryRouter);

// Xuất hàm handler cho Netlify
exports.handler = async (event, context) => {
    return new Promise((resolve) => {
        app.handle(event, context, (err, response) => {
            // Log thông tin về lỗi nếu có
            if (err) {
                console.error('Error in app.handle:', err);
                return resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Internal Server Error' }),
                });
            }
            // Log thông tin phản hồi
            console.log('Handler response:', response);
            resolve(response);
        });
    });
};
