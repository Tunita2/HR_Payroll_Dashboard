import React from 'react';
import '../../styles/table/Table.css';
import { FaRegEdit } from "react-icons/fa";

const TableRow = ({ 
  index, 
  name, 
  department, 
  salary, 
  bonus, 
  deductions,
  total, 
  status 
}) => {
  // Function to get badge class based on status
  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'Present': 'present',
      'Absence': 'absence',
      'Leave': 'leave',
    };
    return statusMap[status] || 'default';
  };

  return (
    <div className="table-row">
      <div className="cell index">{index}</div>
      <div className="cell name">{name}</div>
      <div className="cell department">{department}</div>
      <div className="cell amount">{salary}</div>
      <div className="cell amount">{bonus}</div>
      <div className="cell amount">{deductions}</div>
      <div className="cell amount">{total}</div>
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
  // Salary calculation function
  const calculateTotal = (salary, bonus, deductions) => {
    // Remove '$' and ',' and convert to number
    const baseSalary = parseFloat(salary.replace('$', '').replace(',', ''));
    const bonusAmount = parseFloat(bonus.replace('$', '').replace(',', ''));
    const deductionAmount = parseFloat(deductions.replace('$', '').replace(',', ''));
    
    // Calculate total
    const total = baseSalary + bonusAmount - deductionAmount;
    
    // Return formatted total
    return `$${total.toLocaleString()}`;
  };

  // Updated employee data with calculation
  const employeeData = [
    {
      index: 1,
      name: 'Nguyễn Văn A',
      department: 'IT',
      salary: '$1,000',
      bonus: '$200',
      deductions: '$100',
      status: 'Present'
    },
    {
      index: 2,
      name: 'Trần Thị B',
      department: 'HR',
      salary: '$900',
      bonus: '$150',
      deductions: '$50',
      status: 'Absence'
    },
    {
      index: 3,
      name: 'Lê Văn C',
      department: 'Finance',
      salary: '$1,100',
      bonus: '$250',
      deductions: '$75',
      status: 'Leave'
    }
  ].map(employee => ({
    ...employee,
    total: calculateTotal(employee.salary, employee.bonus, employee.deductions)
  }));

  return (
    <div className="table-container">
      {employeeData.map((employee) => (
        <TableRow 
          key={employee.index}
          {...employee}
        />
      ))}
    </div>
  );
}

export default EmployeeTable;