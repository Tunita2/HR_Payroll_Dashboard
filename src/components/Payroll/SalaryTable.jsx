import React, { useState, useEffect } from 'react';
import { FaSearch, FaHistory, FaFileDownload, FaPlus } from 'react-icons/fa';
import "../../styles/PayrollStyles/tableSalaries.css";

const SalaryTable = () => {
  const [salaryData, setSalaryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchSalaryData = () => {
      try {
        setLoading(true);
        // Simulated API data
        const mockData = [
          {
            id: "SA001",
            employee_id: "EMP101",
            fullname: "John Smith",
            position: "Senior Developer",
            department: "Engineering",
            salaryMonth: "2025-04",
            baseSalary: 5000,
            bonus: 1000,
            deductions: 500,
            netSalary: 5500,
            status: "active"
          },
          {
            id: "SA002",
            employee_id: "EMP102",
            fullname: "Sarah Johnson",
            position: "HR Manager",
            department: "Human Resources",
            salaryMonth: "2025-04",
            baseSalary: 4500,
            bonus: 800,
            deductions: 400,
            netSalary: 4900,
            status: "active"
          },
          // Add more mock data as needed
        ];
        setSalaryData(mockData);
      } catch (err) {
        setError('Failed to fetch salary data');
        console.error('Error fetching salary data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, []);

  const filteredSalaryData = salaryData.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (loading) return <div className="loading">Loading salary data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="appli-table-container">
      <div className="appli-table-header">
        <div className="appli-search-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="table-search-appli-input"
          />
          <FaSearch className="appli-search-bar-icon" />
        </div>
        
        <div className="table-button-container">
          <button className="history">
            <FaHistory /> History
          </button>
          <button className="table-button">
            <FaFileDownload /> Export
          </button>
          <button className="table-button">
            <FaPlus /> New Payroll
          </button>
        </div>
      </div>

      <table className="appli-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Position</th>
            <th>Department</th>
            <th>Month</th>
            <th>Base Salary</th>
            <th>Bonus</th>
            <th>Deductions</th>
            <th>Net Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalaryData.map((item) => (
            <tr key={item.id} className="appli-table-row">
              <td>{item.employee_id}</td>
              <td>{item.fullname}</td>
              <td>{item.position}</td>
              <td>{item.department}</td>
              <td>{item.salaryMonth}</td>
              <td>${item.baseSalary.toLocaleString()}</td>
              <td>${item.bonus.toLocaleString()}</td>
              <td>${item.deductions.toLocaleString()}</td>
              <td>${item.netSalary.toLocaleString()}</td>
              <td>
                <span className={`appli-status-circle ${item.status}`}></span>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </td>
              <td>
                <button className="table-button">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryTable;