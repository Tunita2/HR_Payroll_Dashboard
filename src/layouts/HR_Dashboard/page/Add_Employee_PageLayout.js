import React from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar_Payroll";
import Add_Employee from "../Add_Employee_form";
import "./Add_Employee_PageLayout.css";

const AdminEmployeeLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-body">
            <Add_Employee></Add_Employee>
        </div>
      </div>
    </div>
  );
};

export default AdminEmployeeLayout;
