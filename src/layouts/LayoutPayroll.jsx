import React from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import "../styles/GeneralStyles/Layout.css";
import { Outlet, useLocation } from "react-router-dom";
import PayrollDashboard from "../components/Payroll/PayrollDashboard";
import {menuConfig, settingItems } from "../components/Payroll/PayrollConfig"

const LayoutPayroll = () => {
  const location = useLocation();
  return (
    <div className="dashboard-layout">
      <Sidebar
        menuConfig={ menuConfig }
        settingItems = { settingItems }
        userRole = "Payroll"
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
                location.pathname === "/payroll/report"   ? (
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
