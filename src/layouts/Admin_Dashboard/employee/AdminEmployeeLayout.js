import React from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar_Payroll";
import EmployeeTable from "./EmployeeTable";
import "./EmployeeLayout.css";
import { useNavigate } from "react-router-dom";

const AdminEmployeeLayout = () => {
  const navigate = useNavigate();
  const handleAddEmployee = () =>{
    navigate("/admin/employee-management/add_employee");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-body">
          <h1 className="employee-list-title">Employee list</h1>
          <EmployeeTable />
          <button className="add-employee-button" onClick={handleAddEmployee}>Add employee</button>
        </div>
      </div>
    </div>
  );
};

export default AdminEmployeeLayout;
