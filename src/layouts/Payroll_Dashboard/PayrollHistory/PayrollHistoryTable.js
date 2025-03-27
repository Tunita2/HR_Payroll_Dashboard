import React from "react";
import "./PayrollHistoryTable.css";

const PayrollHistoryTable = ({
  data = [
    {
      name: "Bui Le Tuan",
      department: "IT",
      payDate: "21/03/2025",
      netSalary: "$100",
      idEmployee: "1",
    },
    {
      name: "Bui Le Tuan",
      department: "IT",
      payDate: "21/03/2025",
      netSalary: "$100",
      idEmployee: "1",
    },
    {
      name: "Bui Le Tuan",
      department: "IT",
      payDate: "21/03/2025",
      netSalary: "$100",
      idEmployee: "1",
    },
    {
      name: "Bui Le Tuan",
      department: "IT",
      payDate: "21/03/2025",
      netSalary: "$100",
      idEmployee: "1",
    },
    {
      name: "Bui Le Tuan",
      department: "IT",
      payDate: "21/03/2025",
      netSalary: "$100",
      idEmployee: "1",
    },
    {
      name: "Bui Le Tuan",
      department: "IT",
      payDate: "21/03/2025",
      netSalary: "$100",
      idEmployee: "1",
    },
    {
      name: "Bui Le Tuan",
      department: "IT",
      payDate: "21/03/2025",
      netSalary: "$100",
      idEmployee: "1",
    },
    {
      name: "Bui Le Tuan",
      department: "IT",
      payDate: "21/03/2025",
      netSalary: "$100",
      idEmployee: "1",
    },
    {
      name: "Bui Le Tuan",
      department: "IT",
      payDate: "21/03/2025",
      netSalary: "$100",
      idEmployee: "1",
    },
    {
      name: "Bui Le Tuan",
      department: "IT",
      payDate: "21/03/2025",
      netSalary: "$100",
      idEmployee: "1",
    },
  ],
}) => {
  return (
    <div className="payroll-table-container">
      <div className="payroll-table-header">
        <div className="header-cell name">Name</div>
        <div className="header-cell department">Department</div>
        <div className="header-cell pay-date">Pay date</div>
        <div className="header-cell net-salary">Net salary</div>
        <div className="header-cell id-employee">ID Employee</div>
      </div>
      <div className="payroll-table-body">
        {data.map((row, index) => (
          <div key={index} className="table-row">
            <div className="cell name">{row.name}</div>
            <div className="cell department">{row.department}</div>
            <div className="cell pay-date">{row.payDate}</div>
            <div className="cell net-salary">{row.netSalary}</div>
            <div className="cell id-employee">{row.idEmployee}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayrollHistoryTable;
