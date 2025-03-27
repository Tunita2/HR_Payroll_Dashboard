import React from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import AddEmployeeButton from "./AddEmployeeButton";
import AttendanceTable from "./AttendanceTable";
import "./AttendanceLayout.css";

const AdminEmployeeListLayout = () => {
  return (
    <div className="layout-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="main-content">
        <div className="header-container">
          <Header />
        </div>

        <div className="content-area">
          <div className="add-employee-button-container">
            <AddEmployeeButton />
          </div>

          <div className="attendance-table-container">
            <AttendanceTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEmployeeListLayout;
