import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../../styles/PayrollStyles/tableSalaries.css"


const SalaryTable = () => {
  const [dataSalary, setSalary] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/payroll/salaries');
        const sortedData = res.data.sort((a, b) => a.SalaryID - b.SalaryID);
        setSalary(sortedData);
      } catch (err) {
        console.error("Failed to fetch salary data", err);
      }
    };
    fetchSalary();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getMonthYear = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const allMonths = Array.from(
    new Set(dataSalary.map((item) => getMonthYear(item.SalaryMonth)))
  );

  const filteredData = selectedMonth === "all"
    ? dataSalary
    : dataSalary.filter(item => getMonthYear(item.SalaryMonth) === selectedMonth);

  return (
    <div>
      <div class="appli-table-header">
        <div>Salary list</div>
        <div className="button-group">
          <Link to={'/payroll/salary/history'} style={{ color: 'white' }}>
            <div className="history">Salary history</div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label htmlFor="month-filter">Month:</label>
            <select
              id="month-filter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="all">All Month</option>
              {allMonths.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bảng Dữ liệu attendance */}
      <div>
        <table className="appli-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee ID</th>
              <th>Full name</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary month</th>
              <th>Base salary</th>
              <th>Bonus</th>
              <th>Deductions</th>
              <th>Net salary</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((employee, index) => (
              <tr key={index} className="appli-table-row">
                <td>{employee.SalaryID}</td>
                <td>{employee.EmployeeID}</td>
                <td>{employee.FullName}</td>
                <td>{employee.DepartmentName}</td>
                <td>{employee.PositionName}</td>
                <td>{formatDate(employee.SalaryMonth)}</td>
                <td>{employee.BaseSalary}</td>
                <td>{employee.Bonus}</td>
                <td>{employee.Deductions}</td>
                <td>{employee.NetSalary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  );
};

export default SalaryTable;