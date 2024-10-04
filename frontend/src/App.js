import { React, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from './redux/store.ts'; // Đảm bảo bạn đã tạo store Redux
import Login from './pages/Login/index.jsx'; // Import the Login component
import Header from './components/Header/header.jsx';
import { useAppSelector, useAppDispatch } from './hooks/hooks.ts';
import Footer from './components/Footer/footer.jsx';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { userActions } from './redux/slices/index.js';
import SignUp from './pages/SignUp/index.jsx';
import CheckMail from './pages/CheckMail/index.jsx';
import VerifyEmail from './pages/VerifyEmail/index.jsx';
import Profile from './pages/Profile/index.jsx';
import ForgotPassword from './pages/ForgotPassword/index.jsx';
import ResetPassword from './pages/ResetPassword/index.jsx';
import Blog from './pages/MyBlog/index.jsx';
import PopUpAddBlogCard from './pages/MyBlog/PopUpAddBlogCard.jsx';
import EditBlog from './pages/MyBlog/EditBlog.jsx';
import BlogReview from './pages/MyBlog/ReviewBlog.jsx';
import AdminDashBoard from './pages/Admin/AdminDashboard.jsx';
import BlogHome from './pages/Blog/BlogHome/index.jsx';
import BlogDetail from './pages/Blog/BlogDetail/index.jsx';
import BlogCategory from './pages/Blog/BlogCategory/index.jsx';
import ViewCommentBox from './pages/Blog/BlogDetail/ViewCommentBox.jsx';
const Home = () => {
    const navigate = useNavigate();

    const handleOnClickGoToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Hello, Tailwind CSS!</h1>
                <p className="text-gray-600">
                    Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build
                    custom designs.
                </p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleOnClickGoToLogin}
                >
                    Go to login
                </button>
            </div>
        </div>
    );
};

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            dispatch(userActions.getMe());
        }
        localStorage.removeItem('messages');
    }, [dispatch]);
    const isLogin = useAppSelector((state) => state.userSlice.isLogin); // hoặc lấy từ store hoặc state quản lý đăng nhập
    // const isLogin = true;
    return (
        <Provider store={store}>
            {' '}
            {/* Bọc ứng dụng trong Provider */}
            <BrowserRouter>
                <div id="root" className="flex flex-col min-h-screen">
                    <Header isLogin={isLogin} /> {/* Thay đổi giá trị theo yêu cầu */}
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<BlogHome />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/sign-up" element={<SignUp />} />
                            <Route path="/check-mail" element={<CheckMail />} />
                            <Route path="/verify-email/:token" element={<VerifyEmail />}></Route>
                            <Route path="/profile" element={<Profile />}></Route>
                            <Route path="/forgot-password" element={<ForgotPassword />}></Route>
                            <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
                            <Route path="/my-blog" element={<Blog />}></Route>
                            <Route path="/my-blog/:slug" element={<EditBlog />}></Route>
                            <Route path="/my-blog/review/:slug" element={<BlogReview />}></Route>
                            <Route path="/admin" element={<AdminDashBoard />}></Route>
                            <Route path="/blog/detail/:slug" element={<BlogDetail />} />
                            <Route path="/blog/category/:category_id" element={<BlogCategory />} />
                            <Route path="/comment" element={<ViewCommentBox />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
