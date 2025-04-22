import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FaUsers, FaMoneyBillWave, FaClock, FaChartLine } from 'react-icons/fa';
import "../../styles/PayrollStyles/reportPayroll.css";

const PayrollDashboard = () => {
  const [summaryData, setSummaryData] = useState({
    totalEmployees: 0,
    totalSalary: 0,
    avgAttendance: 0,
    payrollChange: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = () => {
      // Simulated API data
      const mockData = {
        totalEmployees: 156,
        totalSalary: 780000,
        avgAttendance: 94.5,
        payrollChange: 7.8,
        departmentSalaries: [
          { name: 'Engineering', value: 320000 },
          { name: 'HR', value: 150000 },
          { name: 'Marketing', value: 180000 },
          { name: 'Finance', value: 130000 }
        ],
        monthlyTrends: [
          { month: 'Jan', salary: 720000, attendance: 96 },
          { month: 'Feb', salary: 740000, attendance: 95 },
          { month: 'Mar', salary: 760000, attendance: 94 },
          { month: 'Apr', salary: 780000, attendance: 94.5 }
        ]
      };

      setSummaryData({
        totalEmployees: mockData.totalEmployees,
        totalSalary: mockData.totalSalary,
        avgAttendance: mockData.avgAttendance,
        payrollChange: mockData.payrollChange,
        departmentSalaries: mockData.departmentSalaries,
        monthlyTrends: mockData.monthlyTrends
      });
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="payroll-dashboard-container">
      <div className="dashboard-grid">
        {/* Summary Cards */}
        <div className="card">
          <h2><FaUsers /> Total Employees</h2>
          <div className="metric metric-blue">{summaryData.totalEmployees}</div>
          <div className="metric-label">Active Employees</div>
        </div>

        <div className="card">
          <h2><FaMoneyBillWave /> Total Payroll</h2>
          <div className="metric metric-green">
            ${summaryData.totalSalary.toLocaleString()}
          </div>
          <div className="metric-detail">
            Change: {summaryData.payrollChange}% from last month
          </div>
        </div>

        <div className="card">
          <h2><FaClock /> Attendance Rate</h2>
          <div className="metric metric-purple">{summaryData.avgAttendance}%</div>
          <div className="metric-label">Average Attendance</div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Department Salary Distribution */}
        <div className="card">
          <h2><FaChartLine /> Salary by Department</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summaryData.departmentSalaries}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {summaryData.departmentSalaries.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card">
          <h2><FaChartLine /> Monthly Trends</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summaryData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="salary" name="Total Salary" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="attendance" name="Attendance %" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;