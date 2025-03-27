import React from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import EmployeeTable from "./EmployeeTable";
import "./EmployeeLayout.css";

const AdminEmployeeLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-body">
          <h1 className="employee-list-title">Employee list</h1>
          <EmployeeTable />
          <button className="add-employee-button">Add employee</button>
        </div>
      </div>
    </div>
  );
};

export default AdminEmployeeLayout;
