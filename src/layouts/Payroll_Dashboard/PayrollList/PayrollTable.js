import React from "react";
import { FaRegEdit } from "react-icons/fa";
import "./PayrollTable.css";

const EmployeeTable = () => {
  const employeeData = [
    {
      index: 1,
      name: "Nguyễn Văn A",
      department: "IT",
      salary: "$1000",
      bonus: "$200",
      total: "$1200",
      status: "Active",
    },
    {
      index: 2,
      name: "Trần Thị B",
      department: "HR",
      salary: "$900",
      bonus: "$150",
      total: "$1050",
      status: "Inactive",
    },
    {
      index: 3,
      name: "Lê Văn C",
      department: "Finance",
      salary: "$1100",
      bonus: "$250",
      total: "$1350",
      status: "Active",
    },
  ];

  return (
    <div className="table-container">
      {/* Table Header */}
      <div className="table-header">
        {[
          "ID",
          "Name",
          "Department",
          "Base Salary",
          "Bonuses",
          "Net Salary",
          "Status",
          "Action",
        ].map((col, index) => (
          <div
            key={index}
            className={`header-cell ${col.toLowerCase().replace(" ", "-")}`}
          >
            {col}
          </div>
        ))}
      </div>

      {/* Table Rows */}
      {employeeData.map((employee) => (
        <div key={employee.index} className="table-row">
          <div className="cell index">{employee.index}</div>
          <div className="cell name">{employee.name}</div>
          <div className="cell department">{employee.department}</div>
          <div className="cell amount">{employee.salary}</div>
          <div className="cell amount">{employee.bonus}</div>
          <div className="cell amount">{employee.total}</div>
          <div className="cell status">
            <div className={`status-badge ${employee.status.toLowerCase()}`}>
              {employee.status}
            </div>
          </div>
          <div className="cell actions">
            <button className="edit-btn">
              <FaRegEdit />
            </button>
            <button className="view-details">View details</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeTable;
