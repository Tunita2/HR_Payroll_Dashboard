import React from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar_Payroll";
import Table from "./PayrollTable";
import "./PayrollLayout.css";

const PayrollLayout = () => {
  return (
    <div className="payroll-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main-content">
        <div className="header">
          <Header />
        </div>
        <div className="payroll-table">
          <Table />
        </div>
      </div>
    </div>
  );
};

export default PayrollLayout;
