import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import { FaCalendarAlt, FaUsers, FaMoneyBillWave, FaUserClock } from 'react-icons/fa';
import "../../styles/PayrollStyles/reportPayroll.css";

const Report = () => {
  const [reportData, setReportData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('2025-04');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = () => {
      // Simulated API data
      const mockData = {
        employeeStats: {
          active: 156,
          inactive: 4,
          total: 160
        },
        salaryStats: {
          totalSalary: 780000,
          baseSalary: 650000,
          totalBonus: 130000,
          totalDeductions: 78000
        },
        attendanceStats: {
          totalWorkDays: 2860,
          totalAbsentDays: 140,
          totalLeaveDays: 220
        },
        departmentData: [
          { name: 'Engineering', employees: 45, salary: 320000 },
          { name: 'HR', employees: 15, salary: 150000 },
          { name: 'Marketing', employees: 25, salary: 180000 },
          { name: 'Finance', employees: 20, salary: 130000 }
        ],
        employeeDetails: [
          {
            id: 'EMP101',
            name: 'John Smith',
            department: 'Engineering',
            baseSalary: 5000,
            bonus: 1000,
            deductions: 500,
            workDays: 21,
            absentDays: 1
          },
          // Add more employee details as needed
        ]
      };

      setReportData(mockData);
      setLoading(false);
    };

    fetchReportData();
  }, [selectedMonth]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading || !reportData) {
    return <div className="loading">Loading report data...</div>;
  }

  return (
    <div className="min-h-screen">
      <header>
        <div className="title-header">Report System</div>
        <div className="date-selector">
          <label>Report month:</label>
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </header>

      <main className="container">
        {/* Dashboard Overview */}
        <div className="dashboard-grid">
          <div className="card">
            <h2><FaUsers /> Employee Total</h2>
            <div className="metric metric-blue">{reportData.employeeStats.active}</div>
            <div className="metric-label">Active Employees</div>
            <div className="metric-detail">
              {reportData.employeeStats.inactive} Inactive employees
            </div>
          </div>

          <div className="card">
            <h2><FaMoneyBillWave /> Total Salary</h2>
            <div className="metric metric-green">
              {formatCurrency(reportData.salaryStats.totalSalary)}
            </div>
            <div className="metric-detail">
              Base: {formatCurrency(reportData.salaryStats.baseSalary)}
            </div>
            <div className="metric-detail">
              Bonus: {formatCurrency(reportData.salaryStats.totalBonus)}
            </div>
          </div>

          <div className="card">
            <h2><FaUserClock /> Attendance Overview</h2>
            <div className="metric metric-purple">
              {reportData.attendanceStats.totalWorkDays}
            </div>
            <div className="metric-label">Total Working Days</div>
            <div className="metric-detail">
              Absent: {reportData.attendanceStats.totalAbsentDays} days |
              Leave: {reportData.attendanceStats.totalLeaveDays} days
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="card">
            <h2>Salary by Department</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="salary" name="Total Salary" fill="#8884d8" />
                  <Bar dataKey="employees" name="Employee Count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h2>Salary Components</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Base Salary', value: reportData.salaryStats.baseSalary },
                      { name: 'Bonus', value: reportData.salaryStats.totalBonus },
                      { name: 'Deductions', value: reportData.salaryStats.totalDeductions }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Employee Details Table */}
        <div className="card mb-6">
          <h2>Employee Salary Details ({selectedMonth})</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Base Salary</th>
                  <th>Bonus</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Work Days</th>
                  <th>Absent Days</th>
                </tr>
              </thead>
              <tbody>
                {reportData.employeeDetails.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.department}</td>
                    <td>{formatCurrency(employee.baseSalary)}</td>
                    <td>{formatCurrency(employee.bonus)}</td>
                    <td>{formatCurrency(employee.deductions)}</td>
                    <td>{formatCurrency(employee.baseSalary + employee.bonus - employee.deductions)}</td>
                    <td>{employee.workDays}</td>
                    <td>{employee.absentDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Tools */}
        <div className="card mb-6">
          <h2>Report Export Tools</h2>
          <div className="button-group">
            <button className="btn btn-primary" onClick={() => window.print()}>
              Export PDF Report
            </button>
            <button className="btn btn-secondary">
              Export Excel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Report;