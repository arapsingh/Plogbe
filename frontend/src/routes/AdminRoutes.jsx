/* eslint-disable @typescript-eslint/no-var-requires */
const React = require('react');
const { Navigate, Outlet } = require('react-router-dom');
const Cookies = require('js-cookie');
const { useAppSelector } = require('../hooks/hooks.ts');
// const Sidebar = require('../components/Sidebar/Sidebar');
// const FooterAdmin = require('../components/Footer/FooterAdmin');
// const AdminNavbar = require('../components/Navbar/AdminNavbar');
const AdminRoute = () => {
    const accessToken = Cookies.get('accessToken');
    const isAdmin = useAppSelector((state) => state.userSlice.user.is_admin);
    const isLoading = useAppSelector((state) => state.categorySlice.isLoading);

    return isAdmin && accessToken && !isLoading ? (
        <>
            {/* <Sidebar />
            <div className="relative bg-background_2">
                <div className="px-4  ml-80">
                    <AdminNavbar /> */}
            <Outlet />
            {/* <FooterAdmin />
                </div>
            </div> */}
        </>
    ) : (
        <Navigate to={"/"} />
    );
};

module.exports = AdminRoute;
