import React from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import PayrollTable from "./PayrollTable";
import "./PayrollLayout.css";

const AdminPayrollLayout = () => {
  return (
    <div className="layout-container">
      <Sidebar className="sidebar" />
      <div className="content">
        <Header className="header" />
        <div className="main-content">
          <h2 className="title">Payroll list</h2>
          <PayrollTable className="payroll-table" />
        </div>
      </div>
    </div>
  );
};

export default AdminPayrollLayout;
