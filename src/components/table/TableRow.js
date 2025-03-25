import React from 'react';
import '../../styles/table/TableRow.css';
import { FaRegEdit } from "react-icons/fa";

const TableRow = ({ 
  index, 
  name, 
  department, 
  salary, 
  bonus, 
  total, 
  status 
}) => {
  return (
    <div className="table-row">
      <div className="cell index">{index}</div>
      <div className="cell name">{name}</div>
      <div className="cell department">{department}</div>
      <div className="cell amount">{salary}</div>
      <div className="cell amount">{bonus}</div>
      <div className="cell amount">{total}</div>
      <div className="cell status">
        <div className="status-badge">{status}</div>
      </div>
      <div className="cell actions">
        <button className="edit-btn">
          <FaRegEdit />
        </button>
        <button className="view-details">
          View details
        </button>
      </div>
    </div>
  );
};

// Dữ liệu mẫu
const employeeData = [
  {
    index: 1,
    name: 'Nguyễn Văn A',
    department: 'IT',
    salary: '$1000',
    bonus: '$200',
    total: '$1200',
    status: 'Active'
  },
  {
    index: 2,
    name: 'Trần Thị B',
    department: 'HR',
    salary: '$900',
    bonus: '$150',
    total: '$1050',
    status: 'Inactive'
  },
  {
    index: 3,
    name: 'Lê Văn C',
    department: 'Finance',
    salary: '$1100',
    bonus: '$250',
    total: '$1350',
    status: 'Active'
  }
];

// Component bảng
function EmployeeTable() {
  return (
    <div className="table-container">
      {employeeData.map((employee) => (
        <TableRow 
          key={employee.index}
          index={employee.index}
          name={employee.name}
          department={employee.department}
          salary={employee.salary}
          bonus={employee.bonus}
          total={employee.total}
          status={employee.status}
        />
      ))}
    </div>
  );
}

export default EmployeeTable;