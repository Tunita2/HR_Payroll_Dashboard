import React from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import "../styles/GeneralStyles/Layout.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PayrollDashboard from "../components/Payroll/PayrollDashboard";
import { menuConfig, settingItems } from "../components/Payroll/PayrollConfig"

const LayoutPayroll = () => {
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
        userRole="Payroll"
      ></Sidebar>
      <div className="main-content">
        <Header></Header>
        <div className="content-body">
          {/* Kiểm tra nếu đường dẫn là "/staff" thì hiển thị StaffTable, ngược lại hiển thị DashboardTitle */}
          {/* {location.pathname === "/staff" ? <Outlet /> : <DashboardTitle/>} */}
          {
            location.pathname === "/payroll/salary" ||
              location.pathname === "/payroll/attendance" ||
              location.pathname === "/payroll/schedule" ||
              location.pathname === "/payroll/salary/history" ||
              location.pathname === "/payroll/report" ? (
              <Outlet />
            ) : (
              <PayrollDashboard />
            )
          }
        </div>
      </div>
    </div>
  );
};
export default LayoutPayroll;
