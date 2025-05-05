import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../../../styles/PayrollStyles/tableSalaries.css";
import SearchForPayroll from "../../General/SearchForPayroll";

const SalaryTable = () => {
  const [dataSalary, setSalary] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("FullName")
  const [loading, setLoading] = useState(false);

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

  const searchCategories = [
    { value: "FullName", label: "Name" },
    { value: "EmployeeID", label: "Employee ID" },
    { value: "DepartmentName", label: "Department" },
    { value: "PositionName", label: "Position" }
  ];

  const filteredData = dataSalary
    .filter(item => selectedMonth === "all" || getMonthYear(item.SalaryMonth) === selectedMonth)
    .filter(item => {
      if (!searchQuery) return true;

      const searchValue = String(item[searchCategory] || "").toLowerCase();
      return searchValue.includes(searchQuery.toLowerCase());
    });

  return (
    <div>
      <div className='main-title'>Salary list</div>
      <div className="appli-table-header">
        <SearchForPayroll
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          categories={searchCategories}
          placeholder="Search salary information..."
        />
        <div className="button-group">
          <Link to={'/admin/salaries/history'} style={{ color: 'white' }}>
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

      {/* Bảng Dữ liệu salary */}
      {loading ? (
        <div className="loading">Loading salary data...</div>
      ) : filteredData.length > 0 ? (
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
      ) : (
        <div className="no-data">No salary records found</div>
      )}
    </div>
  );
};

export default SalaryTable;