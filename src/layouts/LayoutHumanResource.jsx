import React from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import "../styles/GeneralStyles/Layout.css";
import HR_MainDashboard from "../components/HumanResource/HR_MainDashboard";
import { Outlet, useLocation } from "react-router-dom";
import { menuConfig, settingItems} from "../components/HumanResource/HumanResourceConfig";


const LayoutHumanResource = () => {
  const location = useLocation();
  return (
    <div className="dashboard-layout">
      <Sidebar
        menuConfig={menuConfig}
        settingItems={settingItems}
        userRole="HR"
      ></Sidebar>
      <div className="main-content">
        <Header></Header>
        <div className="content-body">
          {/* Kiểm tra nếu đường dẫn là "/employee" thì hiển thị HR_EmployeeTable, ngược lại hiển thị HR_MainDashboard */}
          {/* {location.pathname === "/employee" ? <Outlet /> : <HR_MainDashboard/>} */}
          {
            location.pathname === "/human/employee" ||
            location.pathname === "/human/dividend" ||
            location.pathname === "/human/position" ||
            location.pathname === "/human/department" ||
            location.pathname === "/human/report" ? (
              <Outlet />
            ) : (
              <HR_MainDashboard />
            )
          }
        </div>
      </div>
    </div>
  );
};
export default LayoutHumanResource;
