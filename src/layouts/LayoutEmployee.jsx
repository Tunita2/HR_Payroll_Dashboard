import React from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import "../styles/GeneralStyles/Layout.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { menuConfig, settingItems } from "../components/Employee/EmployeeConfig"


const LayoutEmployee = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Xử lý logout
    const handleLogout = () => {
        // Xóa token và thông tin người dùng khỏi localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('employeeId');
        localStorage.removeItem('role');

        // Chuyển hướng về trang đăng nhập
        navigate('/');
    };

    // Cập nhật settingItems để thêm chức năng logout
    const updatedSettingItems = settingItems.map(item => {
        if (item.id === 'logout') {
            return { ...item, onClick: handleLogout };
        }
        return item;
    });

    return (
        <div className="dashboard-layout">
            <Sidebar
                menuConfig={menuConfig}
                settingItems={updatedSettingItems}
                userRole="Employee"
            ></Sidebar>
            <div className="main-content">
                <Header></Header>
                <div className="content-body">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
export default LayoutEmployee;
