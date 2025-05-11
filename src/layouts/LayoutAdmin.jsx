import React from "react";
import Sidebar from "../components/General/Sidebar";
import "../styles/GeneralStyles/Layout.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminDashboard from "../components/Admin/AdminDashboard";
import { menuConfig, settingItems } from "../components/Admin/AdminConfig"
const LayoutAdmin = () => {
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
        userRole="Admin"
      ></Sidebar>
      <div className="main-content">
        <div className="content-body">
          {/* Kiểm tra nếu đường dẫn là "/staff" thì hiển thị StaffTable, ngược lại hiển thị DashboardTitle */}
          {/* {location.pathname === "/staff" ? <Outlet /> : <DashboardTitle/>} */}
          {
            location.pathname === "/admin/employees" ||
              location.pathname === "/admin/dividends" ||
              location.pathname === "/admin/departments" ||
              location.pathname === "/admin/positions" ||
              location.pathname === "/admin/salaries" ||
              location.pathname === "/admin/salaries/history" ||
              location.pathname === "/admin/attendances" ||
              location.pathname === "/admin/schedules" ||
              location.pathname === "/admin/reports" ||
              location.pathname === "/admin/alerts" ||
              location.pathname === "/admin/notifications" ? (
              <Outlet />
            ) : (
              <AdminDashboard />
            )
          }
        </div>
      </div>
    </div>
  );
};
export default LayoutAdmin;
