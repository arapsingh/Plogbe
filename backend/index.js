const express = require('express');
const configs = require('./src/configs');
const app = express();
const cors = require('cors');
const routes = require('./src/routes');
const { Server } = require('socket.io'); // Import Socket.IO
const http = require('http'); // Import HTTP module
const corsOptions = {
    origin: 'http://localhost:3000', // Chỉ định nguồn cụ thể
    credentials: true, // Cho phép gửi cookie và thông tin xác thực
    optionsSuccessStatus: 200, // Để tương thích với các trình duyệt cũ
};
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Bạn có thể điều chỉnh origin
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
    },
});
app.use((req, res, next) => {
    req.io = io; // Thêm io vào request object
    next();
});
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/user', routes.userRouter);
app.use('/api/category', routes.categoryRouter);
app.use('/api/blog', routes.blogRouter);
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Lắng nghe sự kiện xác thực
    socket.on('authenticate', (userId) => {
        console.log(`User ${userId} attempting to authenticate with socket ID: ${socket.id}`);

        // Giả sử xác thực đã thành công vì userId có trong cơ sở dữ liệu
        // Bạn có thể thêm logic kiểm tra thực sự ở đây
        const isAuthenticated = true; // Thay đổi logic này cho phù hợp với ứng dụng của bạn

        if (isAuthenticated) {
            // Nếu xác thực thành công, phát tín hiệu thành công
            socket.emit('authenticated', { message: 'Authentication successful!' });
            console.log(`User ${userId} authenticated successfully.`);
        } else {
            // Nếu xác thực thất bại, phát tín hiệu thất bại
            socket.emit('authentication-failed', { message: 'Authentication failed. User ID not found.' });
            console.log(`Authentication failed for user ${userId}.`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(3001, () => {
    console.log('server is running on port:');
});
