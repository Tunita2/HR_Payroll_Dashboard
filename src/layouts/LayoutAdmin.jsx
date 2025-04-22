import React from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import "../styles/GeneralStyles/Layout.css";
import { Outlet, useLocation } from "react-router-dom";
import AdminDashboard from "../components/Admin/AdminDashboard";
import { menuConfig, settingItems } from "../components/Admin/AdminConfig"

const LayoutAdmin = () => {
  const location = useLocation();
  return (
    <div className="dashboard-layout">
      <Sidebar 
        menuConfig={menuConfig}
        settingItems={settingItems}
        userRole="Admin"
      />
      <div className="main-content">
        <Header />
        <div className="content-body">
          {location.pathname === "/admin" ? (
            <AdminDashboard />
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
