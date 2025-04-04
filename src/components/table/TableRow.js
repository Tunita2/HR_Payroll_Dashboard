import React, { useEffect, useState } from 'react';
import '../../styles/table/Table.css';
import { FaRegEdit } from "react-icons/fa";

const formatCurrency = (amount) => {
  return amount ? amount.toLocaleString('vi-VN') + ' đ' : '0 đ';
};

const getStatusBadgeClass = (status) => {
  const statusMap = {
    'active': 'present',  // Hiển thị active dưới dạng "present"
    'inactive': 'absence' // Hiển thị inactive dưới dạng "absence"
  };
  return statusMap[status.toLowerCase()] || 'default';
};


const TableRow = ({ 
  index, 
  name, 
  department, 
  base_salary, 
  bonus, 
  deductions, 
  total, 
  status 
}) => {
  return (
    <div className="table-row">
      <div className="cell index">{index}</div>
      <div className="cell name">{name}</div>
      <div className="cell department">{department}</div>
      <div className="cell amount">{formatCurrency(base_salary)}</div>
      <div className="cell amount">{formatCurrency(bonus)}</div>
      <div className="cell amount">{formatCurrency(deductions)}</div>
      <div className="cell amount">{formatCurrency(total)}</div>
      <div className="cell status">
        <div className={`status-badge ${getStatusBadgeClass(status)}`}>
          {status}
        </div>
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


function EmployeeTable() {
  const [employeeData, setEmployeeData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/employee-payroll')
      .then(res => res.json())
      .then(data => setEmployeeData(data))
      .catch(error => console.error('Lỗi fetch dữ liệu:', error));
  }, []);

  return (
    <div className="table-container">
      {employeeData.length > 0 ? (
        employeeData.map((employee, index) => (
          <TableRow key={index} index={index + 1} {...employee} />
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default EmployeeTable;
