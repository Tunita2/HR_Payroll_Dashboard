import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import '../../styles/PayrollStyles/history.css';

const History = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch employees data on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch salaries when filters change
  useEffect(() => {
    if (selectedEmployee) {
      if (selectedYear) {
        fetchEmployeeSalariesByYear(selectedEmployee, selectedYear);
      } else {
        fetchEmployeeSalaries(selectedEmployee);
      }
    } else if (selectedYear && selectedMonth) {
      fetchSalariesByYearMonth(selectedYear, selectedMonth);
    } else {
      fetchAllSalaries();
    }
  }, [selectedEmployee, selectedYear, selectedMonth]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/payroll/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAllSalaries = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/payroll/salaries');
      if (!response.ok) {
        throw new Error('Failed to fetch salary data');
      }
      const data = await response.json();
      setSalaries(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalariesByYearMonth = async (year, month) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/payroll/salaries?year=${year}&month=${month}`);
      if (!response.ok) {
        throw new Error('Failed to fetch salary data');
      }
      const data = await response.json();
      setSalaries(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeSalaries = async (employeeId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/payroll/salaries/employee/${employeeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee salary data');
      }
      const data = await response.json();
      setSalaries(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeSalariesByYear = async (employeeId, year) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/payroll/salaries/employee/${employeeId}/year/${year}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee salary data for the specified year');
      }
      const data = await response.json();
      setSalaries(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
    setSelectedMonth(''); // Reset month when employee changes
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setSelectedEmployee(''); // Reset employee when month changes
  };

  const resetFilters = () => {
    setSelectedEmployee('');
    setSelectedYear(new Date().getFullYear());
    setSelectedMonth('');
    fetchAllSalaries();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Available years for filtering
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i);
  }

  // Months for filtering
  const months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];

  return (
    <div>
      <div className="header-title">
        <Link to={'/payroll/salary'} className='title-main'>
          <MdOutlineArrowBackIosNew style={{paddingTop: '5px'}}/>
          <span>Back</span>
        </Link>
        <div className='title-main'>Salary history</div>
      </div>
      
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="employee-select">Employee:</label>
          <select 
            id="employee-select" 
            value={selectedEmployee} 
            onChange={handleEmployeeChange}
          >
            <option value="">All Employees</option>
            {employees.map(employee => (
              <option key={employee.EmployeeID} value={employee.EmployeeID}>
                {employee.FullName}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="year-select">Year:</label>
          <select 
            id="year-select" 
            value={selectedYear} 
            onChange={handleYearChange}
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="month-select">Month:</label>
          <select 
            id="month-select" 
            value={selectedMonth} 
            onChange={handleMonthChange}
            disabled={!selectedYear}
          >
            <option value="">All Months</option>
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.name}</option>
            ))}
          </select>
        </div>

        <button onClick={resetFilters} className="reset-button">Reset Filters</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading salary data...</div>
      ) : salaries.length > 0 ? (
        <div className="salary-table-container">
          <table className="salary-table">
            <thead className='thead-table'>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Month</th>
                <th>Base Salary</th>
                <th>Bonus</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((salary) => (
                <tr key={salary.SalaryID}>
                  <td>{salary.FullName}</td>
                  <td>{salary.DepartmentName}</td>
                  <td>{salary.PositionName}</td>
                  <td>{formatDate(salary.SalaryMonth)}</td>
                  <td>{formatCurrency(salary.BaseSalary)}</td>
                  <td>{formatCurrency(salary.Bonus)}</td>
                  <td>{formatCurrency(salary.Deductions)}</td>
                  <td className="net-salary">{formatCurrency(salary.NetSalary)}</td>
                  <td>{new Date(salary.CreatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data">No salary records found for the selected filters</div>
      )}
    </div>
  );
};

export default History;