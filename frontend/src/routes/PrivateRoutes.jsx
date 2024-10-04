/* eslint-disable @typescript-eslint/no-var-requires */
const React = require('react');
const Cookies = require('js-cookie');
const { Navigate, Outlet } = require('react-router-dom');
const { useAppSelector } = require('../hooks/hooks.ts');

const PrivateRoute = () => {
    const isAdmin = useAppSelector(state => state.userSlice.user.is_admin);
    const accessToken = Cookies.get('accessToken');
    return accessToken ? isAdmin ? <Navigate to="/admin" /> : <Outlet /> : <Navigate to="/" />;
};

module.exports = PrivateRoute;
