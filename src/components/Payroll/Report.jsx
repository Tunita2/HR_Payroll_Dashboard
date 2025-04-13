import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import "../../styles/PayrollStyles/reportPayroll.css";

const Reports = () => {
    // Mock data - trong thực tế sẽ được lấy từ API kết nối với database
    const [employeeData, setEmployeeData] = useState([]);
    const [salaryData, setSalaryData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('2025-04');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      // Giả lập API call để lấy dữ liệu từ backend
      const fetchData = async () => {
        setLoading(true);
        
        // Mock data - trong thực tế sẽ gọi API
        const mockEmployees = [
          { EmployeeID: 1, FullName: 'Nguyễn Văn A', DepartmentID: 1, PositionID: 1, Status: 'Active' },
          { EmployeeID: 2, FullName: 'Trần Thị B', DepartmentID: 2, PositionID: 2, Status: 'Active' },
          { EmployeeID: 3, FullName: 'Lê Văn C', DepartmentID: 1, PositionID: 3, Status: 'Active' },
          { EmployeeID: 4, FullName: 'Phạm Thị D', DepartmentID: 3, PositionID: 1, Status: 'Inactive' },
          { EmployeeID: 5, FullName: 'Hoàng Văn E', DepartmentID: 2, PositionID: 2, Status: 'Active' },
        ];
        
        const mockSalaries = [
          { SalaryID: 1, EmployeeID: 1, SalaryMonth: '2025-04-01', BaseSalary: 10000000, Bonus: 1500000, Deductions: 500000, NetSalary: 11000000 },
          { SalaryID: 2, EmployeeID: 2, SalaryMonth: '2025-04-01', BaseSalary: 12000000, Bonus: 2000000, Deductions: 700000, NetSalary: 13300000 },
          { SalaryID: 3, EmployeeID: 3, SalaryMonth: '2025-04-01', BaseSalary: 9000000, Bonus: 1000000, Deductions: 400000, NetSalary: 9600000 },
          { SalaryID: 4, EmployeeID: 4, SalaryMonth: '2025-04-01', BaseSalary: 11000000, Bonus: 0, Deductions: 500000, NetSalary: 10500000 },
          { SalaryID: 5, EmployeeID: 5, SalaryMonth: '2025-04-01', BaseSalary: 15000000, Bonus: 3000000, Deductions: 900000, NetSalary: 17100000 },
        ];
        
        const mockAttendance = [
          { AttendanceID: 1, EmployeeID: 1, WorkDays: 22, AbsentDays: 0, LeaveDays: 0, AttendanceMonth: '2025-04-01' },
          { AttendanceID: 2, EmployeeID: 2, WorkDays: 21, AbsentDays: 1, LeaveDays: 0, AttendanceMonth: '2025-04-01' },
          { AttendanceID: 3, EmployeeID: 3, WorkDays: 20, AbsentDays: 0, LeaveDays: 2, AttendanceMonth: '2025-04-01' },
          { AttendanceID: 4, EmployeeID: 4, WorkDays: 18, AbsentDays: 2, LeaveDays: 2, AttendanceMonth: '2025-04-01' },
          { AttendanceID: 5, EmployeeID: 5, WorkDays: 22, AbsentDays: 0, LeaveDays: 0, AttendanceMonth: '2025-04-01' },
        ];
        
        const mockDepartments = [
          { DepartmentID: 1, DepartmentName: 'IT' },
          { DepartmentID: 2, DepartmentName: 'HR' },
          { DepartmentID: 3, DepartmentName: 'Finance' },
          { DepartmentID: 4, DepartmentName: 'Marketing' },
        ];
  
        setEmployeeData(mockEmployees);
        setSalaryData(mockSalaries);
        setAttendanceData(mockAttendance);
        setDepartmentData(mockDepartments);
        setLoading(false);
      };
      
      fetchData();
    }, []);
  
    // Tính toán dữ liệu tổng hợp cho biểu đồ
    const getDepartmentSalaryData = () => {
      const departmentSalaries = {};
      departmentData.forEach(dept => {
        departmentSalaries[dept.DepartmentID] = {
          name: dept.DepartmentName,
          totalSalary: 1990,
          employeeCount: 20022123
        };
      });
      
      employeeData.forEach(emp => {
        if (emp.Status === 'Active') {
          const salary = salaryData.find(s => s.EmployeeID === emp.EmployeeID);
          if (salary) {
            departmentSalaries[emp.DepartmentID].totalSalary += salary.NetSalary;
            departmentSalaries[emp.DepartmentID].employeeCount += 1;
          }
        }
      });
      
      return Object.values(departmentSalaries);
    };
    
    const getAttendanceOverview = () => {
      let totalWorkDays = 0;
      let totalAbsentDays = 0;
      let totalLeaveDays = 0;
      
      attendanceData.forEach(record => {
        totalWorkDays += record.WorkDays;
        totalAbsentDays += record.AbsentDays;
        totalLeaveDays += record.LeaveDays;
      });
      
      return [
        { name: 'Working days', value: totalWorkDays },
        { name: 'Absent days', value: totalAbsentDays },
        { name: 'Leave days', value: totalLeaveDays }
      ];
    };
    
    const getSalaryComponents = () => {
      let totalBase = 0;
      let totalBonus = 0;
      let totalDeductions = 0;
      
      salaryData.forEach(salary => {
        totalBase += salary.BaseSalary;
        totalBonus += salary.Bonus;
        totalDeductions += salary.Deductions;
      });
      
      return [
        { name: 'Base salary', value: totalBase },
        { name: 'Bonus', value: totalBonus },
        { name: 'Deduction', value: totalDeductions }
      ];
    };
  
    // Tạo dữ liệu chi tiết nhân viên kết hợp với lương và chuyên cần
    const getEmployeeDetailData = () => {
      return employeeData.map(emp => {
        const salary = salaryData.find(s => s.EmployeeID === emp.EmployeeID) || {};
        const attendance = attendanceData.find(a => a.EmployeeID === emp.EmployeeID) || {};
        const department = departmentData.find(d => d.DepartmentID === emp.DepartmentID)?.DepartmentName || '';
        
        return {
          ...emp,
          department,
          baseSalary: salary.BaseSalary || 0,
          bonus: salary.Bonus || 0,
          deductions: salary.Deductions || 0,
          netSalary: salary.NetSalary || 0,
          workDays: attendance.WorkDays || 0,
          absentDays: attendance.AbsentDays || 0,
          leaveDays: attendance.LeaveDays || 0
        };
      });
    };
  
    // Màu sắc cho biểu đồ
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    
    // Định dạng tiền VND
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 2
      }).format(value);
    };    
  
    if (loading) {
      return <div className="loading">Đang tải dữ liệu...</div>;
    }
  return (
    <div className="min-h-screen">
      <header>
          <div className='title-header'>Report system</div>
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
            <h2>Employee total</h2>
            <div className="metric metric-blue">{employeeData.filter(e => e.Status === 'Active').length}</div>
            <div className="metric-label">Employees are working</div>
            <div className="metric-detail">
              {employeeData.filter(e => e.Status === 'Inactive').length} Inactive employee
            </div>
          </div>

          <div className="card">
            <h2>Total salary for month {selectedMonth}</h2>
            <div className="metric metric-green">
              {formatCurrency(salaryData.reduce((sum, item) => sum + item.NetSalary, 0))}
            </div>
            <div className="metric-detail">
              Base salary: {formatCurrency(salaryData.reduce((sum, item) => sum + item.BaseSalary, 0))}
            </div>
            <div className="metric-detail">
              Bonus: {formatCurrency(salaryData.reduce((sum, item) => sum + item.Bonus, 0))}
            </div>
          </div>

          <div className="card">
            <h2>Attendance overview</h2>
            <div className="metric metric-purple">
              {attendanceData.reduce((sum, item) => sum + item.WorkDays, 0)}
            </div>
            <div className="metric-label">Total working days</div>
            <div className="metric-detail">
              Absent: {attendanceData.reduce((sum, item) => sum + item.AbsentDays, 0)} days |
              On leave: {attendanceData.reduce((sum, item) => sum + item.LeaveDays, 0)} days
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="card">
            <h2>Salary by department</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getDepartmentSalaryData()}>
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
                    data={getSalaryComponents()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getSalaryComponents().map((entry, index) => (
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
                    data={getAttendanceOverview()}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {getAttendanceOverview().map((entry, index) => (
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
                  data={getEmployeeDetailData().slice(0, 5)}
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
          <h2>Employee salary details (Month {selectedMonth})</h2>
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
                {getEmployeeDetailData().map((employee) => (
                  <tr key={employee.EmployeeID} className={employee.Status === 'Inactive' ? 'inactive-row' : ''}>
                    <td>{employee.EmployeeID}</td>
                    <td className="font-medium">{employee.FullName}</td>
                    <td>{employee.department}</td>
                    <td className="text-right">{formatCurrency(employee.baseSalary)}</td>
                    <td className="text-right">{formatCurrency(employee.bonus)}</td>
                    <td className="text-right">{formatCurrency(employee.deductions)}</td>
                    <td className="text-right font-bold">{formatCurrency(employee.netSalary)}</td>
                    <td className="text-center">{employee.workDays}</td>
                    <td className="text-center">{employee.absentDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="card mb-6">
          <h2>Report Export Tool</h2>
          <button className="btn btn-primary" onClick={() => window.print()}>
          Export PDF report
          </button>
          <button className="btn btn-secondary" style={{ marginLeft: '10px' }}>
            Export Excel
          </button>
        </div>
      </main>
    </div>
  );
};

export default Reports;