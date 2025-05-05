import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import "../../styles/PayrollStyles/reportPayroll.css";
import axios from 'axios';

// Configure API base URL with port
const API_BASE_URL = 'http://localhost:3001'; // Change this to your actual backend URL and port

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

const Reports = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalEmployees, setTotalEmployees] = useState({ active: 0, inactive: 0, total: 0 });
  const [attendanceData, setAttendanceData] = useState({
    totalWorkingDays: 0,
    absentDays: 0,
    leaveDays: 0
  });
  const [attendanceDataList, setAttendanceDataList] = useState([]);

  const [summaryData, setSummaryData] = useState({
    totalEmployees: 0,
    totalBaseSalary: 0,
    totalBonus: 0,
    totalDeductions: 0,
    totalNetSalary: 0,
    averageSalary: 0,
    departmentTotals: []
  });

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
    fetchEmployeeData();
    fetchAttendanceData();
  }, []);

  // Fetch payroll data when filters change
  useEffect(() => {
    fetchPayrollData();
  }, [selectedYear, selectedMonth, selectedDepartment]);

  // Calculate summary data when payroll data changes
  useEffect(() => {
    calculateSummaryData();
  }, [payrollData]);


  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/payroll/departments');
      setDepartments(response.data);
    } catch (err) {
      setError("Failed to fetch departments: " + err.message);
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const response = await api.get('/api/payroll/employees');
      const employees = response.data;

      setTotalEmployees({
        active: employees.filter(e => e.Status === 'Active').length,
        inactive: employees.filter(e => e.Status === 'Inactive').length,
        total: employees.length
      });
    } catch (err) {
      console.error("Error fetching employee data:", err);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await api.get(`/api/payroll/attendance?year=${selectedYear}&month=${selectedMonth}`);
      const data = response.data;

      const totalWorkingDays = data.reduce((sum, emp) => sum + (emp.WorkDays || 0), 0);
      const totalAbsentDays = data.reduce((sum, emp) => sum + (emp.AbsentDays || 0), 0);
      const totalLeaveDays = data.reduce((sum, emp) => sum + (emp.LeaveDays || 0), 0);

      setAttendanceDataList(data);
      setAttendanceData({
        totalWorkingDays, // Default to 22 if not provided
        absentDays: totalAbsentDays,
        leaveDays: totalLeaveDays
      });
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      // Set default values if API fails
      setAttendanceData({
        totalWorkingDays: 22,
        absentDays: 0,
        leaveDays: 0
      });
      setAttendanceDataList([]);
    }
  };

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      let url = `/api/payroll/salaries?year=${selectedYear}&month=${selectedMonth}`;

      if (selectedDepartment) {
        url += `&departmentId=${selectedDepartment}`;
      }

      const response = await api.get(url);
      const data = response.data;

      setPayrollData(data);
      setError(null);

      // Update attendance data when payroll data changes
      fetchAttendanceData();
    } catch (err) {
      setError("Failed to fetch payroll data: " + err.message);
      console.error("Error fetching payroll data:", err);
      setPayrollData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummaryData = () => {
    if (payrollData.length === 0) {
      setSummaryData({
        totalEmployees: 0,
        totalBaseSalary: 0,
        totalBonus: 0,
        totalDeductions: 0,
        totalNetSalary: 0,
        averageSalary: 0,
        departmentTotals: []
      });
      return;
    }

    // Calculate totals
    const totalEmployees = payrollData.length;
    const totalBaseSalary = payrollData.reduce((sum, item) => sum + parseFloat(item.BaseSalary || 0), 0);
    const totalBonus = payrollData.reduce((sum, item) => sum + parseFloat(item.Bonus || 0), 0);
    const totalDeductions = payrollData.reduce((sum, item) => sum + parseFloat(item.Deductions || 0), 0);
    const totalNetSalary = payrollData.reduce((sum, item) => sum + parseFloat(item.NetSalary || 0), 0);
    const averageSalary = totalNetSalary / totalEmployees;

    // Group by department
    const departmentGroups = {};
    payrollData.forEach(item => {
      const deptName = item.DepartmentName || 'Unassigned';
      if (!departmentGroups[deptName]) {
        departmentGroups[deptName] = {
          name: deptName,
          count: 0,
          totalSalary: 0,
          employeeCount: 0
        };
      }
      departmentGroups[deptName].count += 1;
      departmentGroups[deptName].employeeCount += 1;
      departmentGroups[deptName].totalSalary += parseFloat(item.NetSalary || 0);
    });

    const departmentTotals = Object.values(departmentGroups).map(dept => ({
      ...dept,
      averageSalary: dept.totalSalary / dept.count
    }));

    setSummaryData({
      totalEmployees,
      totalBaseSalary,
      totalBonus,
      totalDeductions,
      totalNetSalary,
      averageSalary,
      departmentTotals
    });
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedYear(date.getFullYear());
    setSelectedMonth(date.getMonth() + 1);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
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

  // Export to Excel function
  const exportToExcel = async () => {
    try {
      const response = await api.get(`/api/export/excel?year=${selectedYear}&month=${selectedMonth}`, {
        responseType: 'blob'
      });

      // Create a download link for the Excel file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PayrollReport_${selectedYear}_${selectedMonth}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      alert("Failed to export Excel report. Please try again.");
    }
  };

  // Màu sắc cho biểu đồ
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Định dạng tiền VND
  const formatCurrency = (value) => {
    // Ensure value is a number
    const numValue = Number(value) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(numValue);
  };

  // Prepare data for salary components pie chart
  const salaryComponentsData = [
    { name: "Base Salary", value: summaryData.totalBaseSalary },
    { name: "Bonus", value: summaryData.totalBonus },
    { name: "Deductions", value: -summaryData.totalDeductions }
  ];

  // Prepare attendance pie chart data
  const attendancePieData = [
    { name: "Working Days", value: attendanceData.totalWorkingDays - attendanceData.absentDays - attendanceData.leaveDays },
    { name: "Absent", value: attendanceData.absentDays },
    { name: "On Leave", value: attendanceData.leaveDays }
  ];

  // Get top 5 salaries for bar chart
  const topSalaries = [...payrollData]
    .sort((a, b) => parseFloat(b.NetSalary || 0) - parseFloat(a.NetSalary || 0))
    .slice(0, 5)
    .map(emp => ({
      EmployeeID: emp.EmployeeID,
      FullName: emp.FullName || `Employee ${emp.EmployeeID}`,
      netSalary: parseFloat(emp.NetSalary || 0)
    }));

  if (loading && payrollData.length === 0) {
    return <div className="loading">Loading data...</div>;
  }

  const mergedPayroll = payrollData.map((emp) => {
    const attendance = attendanceDataList.find((a) => a.EmployeeID === emp.EmployeeID) || {};
    return {
      ...emp,
      WorkDays: attendance.WorkDays || 0,
      AbsentDays: attendance.AbsentDays || 0,
    };
  });

  return (
    <div className='body'>
      <div className="min-h-screen">
        <header>
          <div className='title-header'>Report System</div>
          <div className="date-selector">
            <label>Report month:</label>
            <input
              type="month"
              value={`${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`}
              onChange={(e) => handleMonthChange(e)}
            />
          </div>
        </header>

        <main className="container">
          {/* Dashboard Overview */}
          <div className="dashboard-grid">
            <div className="card">
              <h2>Employee Total</h2>
              <div className="metric metric-blue">{totalEmployees.active}</div>
              <div className="metric-label">Employees are working</div>
              <div className="metric-detail">
                {totalEmployees.inactive} Inactive employee
              </div>
            </div>

            <div className="card">
              <h2>Total salary for month {months.find(m => m.value === selectedMonth)?.name}</h2>
              <div className="metric metric-green">
                {formatCurrency(summaryData.totalNetSalary)}
              </div>
              <div className="metric-detail">
                Base salary: {formatCurrency(summaryData.totalBaseSalary)}
              </div>
              <div className="metric-detail">
                Bonus: {formatCurrency(summaryData.totalBonus)}
              </div>
            </div>

            <div className="card">
              <h2>Attendance overview</h2>
              <div className="metric metric-purple">
                {attendanceData.totalWorkingDays}
              </div>
              <div className="metric-label">Total working days</div>
              <div className="metric-detail">
                Absent: {attendanceData.absentDays} days |
                On leave: {attendanceData.leaveDays} days
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="card">
              <h2>Salary by department</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summaryData.departmentTotals}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="totalSalary" name="Total salary" fill="#8884d8" />
                    <Bar dataKey="employeeCount" name="Employee number" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h2>Salary components</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salaryComponentsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {salaryComponentsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="card">
              <h2>Attendance statistic</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendancePieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {attendancePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h2>Salary per employee</h2>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topSalaries}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="FullName" width={100} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="netSalary" name="Net salary" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Employee Salaries Table */}
          <div className="card mb-6">
            <h2>Employee salary details (Month {months.find(m => m.value === selectedMonth)?.name})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full name</th>
                    <th>Department</th>
                    <th className="text-right">Base salary</th>
                    <th className="text-right">Bonus</th>
                    <th className="text-right">Deduction</th>
                    <th className="text-right">Net salary</th>
                    <th className="text-center">Working days</th>
                    <th className="text-center">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {mergedPayroll.map((employee) => (
                    <tr key={employee.EmployeeID} className={employee.Status === 'Inactive' ? 'inactive-row' : ''}>
                      <td>{employee.EmployeeID}</td>
                      <td className="font-medium">{employee.FullName}</td>
                      <td>{employee.DepartmentName}</td>
                      <td className="text-right">{formatCurrency(employee.BaseSalary)}</td>
                      <td className="text-right">{formatCurrency(employee.Bonus)}</td>
                      <td className="text-right">{formatCurrency(employee.Deductions)}</td>
                      <td className="text-right font-bold">{formatCurrency(employee.NetSalary)}</td>
                      <td className="text-center">{employee.WorkDays || 0}</td>
                      <td className="text-center">{employee.AbsentDays || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card mb-6">
            <h2>Report Export Tool</h2>
            <button className="btns btn-primary" onClick={() => window.print()}>
              Export PDF report
            </button>
            <button className="btns btn-secondary" style={{ marginLeft: '10px' }} onClick={exportToExcel}>
              Export Excel
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;