import React from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import "../styles/GeneralStyles/Layout.css";
import { Outlet, useLocation } from "react-router-dom";
import { menuConfig, settingItems } from "../components/Employee/EmployeeConfig"
import MyProfile from "../components/Employee/MyProfile";
const LayoutAdmin = () => {
    const location = useLocation();
    return (
        <div className="dashboard-layout">
            <Sidebar
                menuConfig={menuConfig}
                settingItems={settingItems}
                userRole="Employee"
            ></Sidebar>
            <div className="main-content">
                <Header></Header>
                <div className="content-body">

                    {
                        location.pathname === "/employee/my-payroll" ||
                            location.pathname === "/employee/leave-work" ||
                            location.pathname === "/employee/notifications" ? (
                            <Outlet />
                        ) : (
                            <MyProfile />
                        )
                    }
                </div>
            </div>
        </div>
    );
};
export default LayoutAdmin;
