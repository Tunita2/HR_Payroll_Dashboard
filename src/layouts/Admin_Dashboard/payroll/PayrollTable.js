import React from "react";
import "./PayrollTable.css";

const PayrollTable = ({ style }) => {
  // Sample data - in real app this would come from props or API
  const payrollData = Array(10).fill({
    id: 1,
    name: "Bui Le Tuan",
    department: "IT",
    baseSalary: "$100",
    bonuses: "$15",
    deductions: "$100",
    netSalary: "$100",
    status: "Active",
  });

  return (
    <div className="payroll-table" style={style}>
      <div className="table-header">
        <div className="header-cell id-cell">ID</div>
        <div className="header-cell name-cell">Name</div>
        <div className="header-cell dept-cell">Department</div>
        <div className="header-cell">Base salary</div>
        <div className="header-cell">Bonuses</div>
        <div className="header-cell">Deductions</div>
        <div className="header-cell">Net salary</div>
        <div className="header-cell">Status</div>
        <div className="header-cell action-cell">Action</div>
      </div>

      {payrollData.map((row, index) => (
        <div key={index} className="table-row">
          <div className="table-cell id-cell">{row.id}</div>
          <div className="table-cell name-cell">{row.name}</div>
          <div className="table-cell dept-cell">{row.department}</div>
          <div className="table-cell">{row.baseSalary}</div>
          <div className="table-cell">{row.bonuses}</div>
          <div className="table-cell">{row.deductions}</div>
          <div className="table-cell">{row.netSalary}</div>
          <div className="table-cell">{row.status}</div>
          <div className="table-cell action-cell">
            <button className="edit-button">
              <img
                src="https://dashboard.codeparrot.ai/api/image/Z-KrgAzgNnZiU9dX/edit.png"
                alt="edit"
              />
            </button>
            <button className="view-details">View details</button>
          </div>
        </div>
      ))}
    </div>
  );
};

PayrollTable.defaultProps = {
  style: {
    flexGrow: 1,
    height: "auto",
  },
};

export default PayrollTable;
