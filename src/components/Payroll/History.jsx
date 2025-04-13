import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import '../../styles/PayrollStyles/history.css';

const History = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filter, setFilter] = useState({
    department: 'all',
    position: 'all',
  });

  // Simulate fetching data from an API
  useEffect(() => {
    // In a real Historylication, these would be API calls
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data based on the database schema
        const mockEmployees = [
          { EmployeeID: 1, FullName: 'John Doe', DepartmentID: 1, PositionID: 1, Status: 'Active' },
          { EmployeeID: 2, FullName: 'Jane Smith', DepartmentID: 2, PositionID: 3, Status: 'Active' },
          { EmployeeID: 3, FullName: 'Robert Johnson', DepartmentID: 1, PositionID: 2, Status: 'Active' },
          { EmployeeID: 4, FullName: 'Emily Davis', DepartmentID: 3, PositionID: 4, Status: 'Inactive' },
          { EmployeeID: 5, FullName: 'Michael Wilson', DepartmentID: 2, PositionID: 1, Status: 'Active' },
        ];

        const mockDepartments = [
          { DepartmentID: 1, DepartmentName: 'IT' },
          { DepartmentID: 2, DepartmentName: 'HR' },
          { DepartmentID: 3, DepartmentName: 'Finance' },
        ];

        const mockPositions = [
          { PositionID: 1, PositionName: 'Software Developer' },
          { PositionID: 2, PositionName: 'System Administrator' },
          { PositionID: 3, PositionName: 'HR Manager' },
          { PositionID: 4, PositionName: 'Financial Analyst' },
        ];

        setEmployees(mockEmployees);
        setDepartments(mockDepartments);
        setPositions(mockPositions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load salary history when an employee is selected
  useEffect(() => {
    if (selectedEmployee) {
      // In a real Historylication, this would be an API call
      const fetchSalaryHistory = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockSalaryHistory = generateSalaryHistory(selectedEmployee.EmployeeID);
        setSalaryHistory(mockSalaryHistory);
        setLoading(false);
      };

      fetchSalaryHistory();
    }
  }, [selectedEmployee]);

  // Helper function to generate salary history
  const generateSalaryHistory = (employeeId) => {
    const startYear = 2020;
    const currentYear = new Date().getFullYear();

    let mockSalaries = [];
    let baseSalary = 50000 + (employeeId * 10000);

    for (let year = startYear; year <= currentYear; year++) {
      for (let month = 1; month <= 12; month++) {
        if (year === currentYear && month > new Date().getMonth() + 1) continue;

        const bonus = Math.floor(Math.random() * 2000);
        const deductions = Math.floor(Math.random() * 1000);
        const netSalary = baseSalary + bonus - deductions;

        mockSalaries.push({
          SalaryID: mockSalaries.length + 1,
          EmployeeID: employeeId,
          SalaryMonth: `${year}-${month.toString().padStart(2, '0')}-01`,
          BaseSalary: baseSalary,
          Bonus: bonus,
          Deductions: deductions,
          NetSalary: netSalary,
          CreatedAt: new Date().toISOString()
        });
      }
      baseSalary += Math.floor(baseSalary * 0.05);
    }

    return mockSalaries;
  };

  // Filter employees based on department and position
  const filteredEmployees = employees.filter(employee => {
    if (filter.department !== 'all' && employee.DepartmentID !== parseInt(filter.department)) return false;
    if (filter.position !== 'all' && employee.PositionID !== parseInt(filter.position)) return false;
    return true;
  });

  // Filter salary history based on selected year
  const filteredSalaryHistory = salaryHistory.filter(salary => {
    return new Date(salary.SalaryMonth).getFullYear() === selectedYear;
  });

  // Helper to get department name by ID
  const getDepartmentName = (id) => {
    const department = departments.find(dept => dept.DepartmentID === id);
    return department ? department.DepartmentName : 'Unknown';
  };

  // Helper to get position name by ID
  const getPositionName = (id) => {
    const position = positions.find(pos => pos.PositionID === id);
    return position ? position.PositionName : 'Unknown';
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };

  return (
    <div>
      <div className="header-title">
        <Link to={'/payroll/salary'} className='title-main'>
          <MdOutlineArrowBackIosNew style={{paddingTop: '5px'}}/>
          <span>Back</span>
        </Link>
        <div className='title-main'>Salary history</div>
      </div>
      {loading && !selectedEmployee ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading employee data...</p>
        </div>
      ) : (
        <div className="dashboard-content">
          <aside className="sidebar">
            <h2>Employees</h2>

            <div className="filter-section">
              <div className="filter-group">
                <label>Department:</label>
                <select
                  value={filter.department}
                  onChange={(e) => setFilter({ ...filter, department: e.target.value })}
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.DepartmentID} value={dept.DepartmentID}>
                      {dept.DepartmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Position:</label>
                <select
                  value={filter.position}
                  onChange={(e) => setFilter({ ...filter, position: e.target.value })}
                >
                  <option value="all">All Positions</option>
                  {positions.map(pos => (
                    <option key={pos.PositionID} value={pos.PositionID}>
                      {pos.PositionName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="employee-list">
              {filteredEmployees.map(employee => (
                <div
                  key={employee.EmployeeID}
                  className={`employee-card ${selectedEmployee?.EmployeeID === employee.EmployeeID ? 'active' : ''}`}
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <div className="employee-name">{employee.FullName}</div>
                  <div className="employee-dept">{getDepartmentName(employee.DepartmentID)}</div>
                  <div className="employee-position">{getPositionName(employee.PositionID)}</div>
                  <div className={`employee-status ${employee.Status.toLowerCase()}`}>{employee.Status}</div>
                </div>
              ))}

              {filteredEmployees.length === 0 && (
                <p className="no-results">No employees match the selected filters</p>
              )}
            </div>
          </aside>

          <main style={{ paddingLeft: '10px', width: '75%' }}>
            {selectedEmployee ? (
              <div className="salary-container">
                <div className="employee-details">
                  <h2>{selectedEmployee.FullName}</h2>
                  <div className="employee-info">
                    <div className="info-item">
                      <span className="info-label">Department:</span>
                      <span className="info-value">{getDepartmentName(selectedEmployee.DepartmentID)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Position:</span>
                      <span className="info-value">{getPositionName(selectedEmployee.PositionID)}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Status:</span>
                      <span className={`info-value status ${selectedEmployee.Status.toLowerCase()}`}>
                        {selectedEmployee.Status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="salary-history-section">
                  <div className="section-header">
                    <h3>Salary over the years</h3>
                    <select
                      className="year-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                      {[...Array(new Date().getFullYear() - 2019)].map((_, i) => (
                        <option key={i} value={2020 + i}>
                          {2020 + i}
                        </option>
                      ))}
                    </select>
                  </div>

                  {loading ? (
                    <div className="loading">
                      <div className="spinner"></div>
                      <p>Loading salary data...</p>
                    </div>
                  ) : (
                    <>
                      <div className="table-responsive">
                        <table className="salary-table">
                          <thead>
                            <tr>
                              <th>Month</th>
                              <th>Base Salary</th>
                              <th>Bonus</th>
                              <th>Deductions</th>
                              <th>Net Salary</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredSalaryHistory.map(salary => (
                              <tr key={salary.SalaryID}>
                                <td>{formatDate(salary.SalaryMonth)}</td>
                                <td>{formatCurrency(salary.BaseSalary)}</td>
                                <td className="bonus">{formatCurrency(salary.Bonus)}</td>
                                <td className="deduction">{formatCurrency(salary.Deductions)}</td>
                                <td className="net-salary">{formatCurrency(salary.NetSalary)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {filteredSalaryHistory.length === 0 && (
                        <p className="no-results">No salary data available for {selectedYear}</p>
                      )}

                      {filteredSalaryHistory.length > 0 && (
                        <div className="annual-summary">
                          <h4>Annual Summary for {selectedYear}</h4>
                          <div className="summary-cards">
                            <div className="summary-card base-salary">
                              <div className="card-label">Total Base Salary</div>
                              <div className="card-value">
                                {formatCurrency(filteredSalaryHistory.reduce((sum, item) => sum + item.BaseSalary, 0))}
                              </div>
                            </div>
                            <div className="summary-card bonuses">
                              <div className="card-label">Total Bonuses</div>
                              <div className="card-value">
                                {formatCurrency(filteredSalaryHistory.reduce((sum, item) => sum + item.Bonus, 0))}
                              </div>
                            </div>
                            <div className="summary-card deductions">
                              <div className="card-label">Total Deductions</div>
                              <div className="card-value">
                                {formatCurrency(filteredSalaryHistory.reduce((sum, item) => sum + item.Deductions, 0))}
                              </div>
                            </div>
                            <div className="summary-card net-salary">
                              <div className="card-label">Total Net Salary</div>
                              <div className="card-value">
                                {formatCurrency(filteredSalaryHistory.reduce((sum, item) => sum + item.NetSalary, 0))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="select-employee-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                </svg>
                <p>Select an employee to view salary history</p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default History;