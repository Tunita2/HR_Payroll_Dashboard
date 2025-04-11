import React from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import "../styles/GeneralStyles/Layout.css";
import HumanResourceDashboard from "../components/HumanResource/HumanResourceDashboard";
import { Outlet, useLocation } from "react-router-dom";
import {menuConfig, settingItems } from "../components/HumanResource/HumanResourceConfig"

const LayoutHumanResource = () => {
  const location = useLocation();
  return (
    <div className="dashboard-layout">
      <Sidebar 
        menuConfig={ menuConfig }
        settingItems = { settingItems }
        userRole = "HR"
      ></Sidebar>
      <div className="main-content">
        <Header></Header>
        <div className="content-body">
            {/* Kiểm tra nếu đường dẫn là "/staff" thì hiển thị StaffTable, ngược lại hiển thị DashboardTitle */}
            {/* {location.pathname === "/staff" ? <Outlet /> : <DashboardTitle/>} */}
            {
                location.pathname === "/human-resource/staff" ||
                location.pathname === "/human-resource/applicant" ||
                location.pathname === "/human-resource/department" ||
                location.pathname === "/human-resource/report"   ? (
                    <Outlet />
                ) : (
                    <HumanResourceDashboard />
                )
            }
        </div>
      </div>
    </div>
  );
};
export default LayoutHumanResource;