import React from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import "../styles/GeneralStyles/Layout.css";
import { Outlet, useLocation } from "react-router-dom";
import AdminDashboard from "../components/Admin/AdminDashboard";
import {menuConfig, settingItems } from "../components/Admin/AdminConfig"
const LayoutAdmin = () => {
  const location = useLocation();
  return (
    <div className="dashboard-layout">
      <Sidebar 
        menuConfig={ menuConfig }
        settingItems = { settingItems }
        userRole = "Admin"
      ></Sidebar>
      <div className="main-content">
        <Header></Header>
        <div className="content-body">
            {/* Kiểm tra nếu đường dẫn là "/staff" thì hiển thị StaffTable, ngược lại hiển thị DashboardTitle */}
            {/* {location.pathname === "/staff" ? <Outlet /> : <DashboardTitle/>} */}
            {
                location.pathname === "/admin/staffs" ||
                location.pathname === "/admin/applicants" ||
                location.pathname === "/admin/departments" ||
                location.pathname === "/admin/jobtitles"   ||
                location.pathname === "/admin/salaries" ||
                location.pathname === "/admin/attendances" ||
                location.pathname === "/admin/reports" ||
                location.pathname === "/admin/alerts-and-notifications" ? (
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
