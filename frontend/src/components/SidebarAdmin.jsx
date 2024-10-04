import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs } from 'antd';
import { ArrowLeftOutlined, UserOutlined, BookOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import Sider from 'antd/es/layout/Sider';
const { TabPane } = Tabs;

const SidebarAdmin = ({ onChangeTab }) => {
    const siderStyle = {
        backgroundColor: '#D8D8D8',
        padding: '16px',
    };

    const tabPaneStyle = {
        fontSize: '18px',
    };

    return (
        <Sider style={siderStyle} width={300}>
            {/* <Link
                to={`/admin`} // Đường dẫn về trang admin
                className="flex gap-1 items-center hover:text-blue-400 transition-all duration-300"
            >
                <ArrowLeftOutlined className="w-5 h-5" />
                <p className="text-lg ml-10">Về trang quản trị</p>
            </Link> */}
            <div className="w-[270px] h-px bg-lightorange mb-4"></div>
            <p className="text-2xl font-medium text-blue-400 ml-16 mb-5 max-w-[200px] break-words whitespace-normal">
                Quản lý
            </p>
            <Tabs defaultActiveKey="2" tabPosition="left" onChange={onChangeTab}>
                <TabPane
                    tab={
                        <span style={tabPaneStyle} className="ml-10">
                            <UserOutlined /> Người dùng
                        </span>
                    }
                    key="1"
                >
                    {/* Nội dung tab Người dùng */}
                </TabPane>
                <TabPane
                    tab={
                        <span style={tabPaneStyle} className="ml-10">
                            <BookOutlined /> Danh mục
                        </span>
                    }
                    key="2"
                >
                    {/* Nội dung tab Danh mục */}
                </TabPane>
            </Tabs>
        </Sider>
    );
};
SidebarAdmin.propTypes = {
    onChangeTab: PropTypes.func.isRequired,
}
export default SidebarAdmin;
