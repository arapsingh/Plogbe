import Spin from '../../components/Spin';
import { useAppSelector } from '../../hooks/hooks.ts';
import { Layout } from 'antd';
import SidebarAdmin from '../../components/SidebarAdmin.jsx';
import { useState } from 'react';
import Category from './Category/index.jsx';
import User from './User/index.jsx';
const AdminDashBoard = () => {
    const [activeTabKey, setActiveTabKey] = useState('2');

    const handleChangeTab = (key) => {
        setActiveTabKey(key);
        // Thực hiện các hành động khác nếu cần khi tab thay đổi
    };
    // const isGetLoading = useAppSelector((state) => state.categorySlice.isGetLoading);
    const renderTabContent = () => {
        switch (activeTabKey) {
            case '1':
                return <User />;
            case '2':
                return <Category />;
            default:
                return <Category />;
        }
    };
    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <SidebarAdmin onChangeTab={handleChangeTab} />
                <Layout.Content style={{ padding: '20px' }}>{renderTabContent()}</Layout.Content>{' '}
            </Layout>
        </>
    );
};
export default AdminDashBoard;
