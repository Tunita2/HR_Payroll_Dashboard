import { useState, useEffect} from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Users, DollarSign, BarChart2 } from 'lucide-react';
import '../../styles/AdminStyles/Reports.css';
import '../../styles/AdminStyles/ReportsWhiteText.css';
import axiosInstance from './axiosInstance';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [periodFilter, setPeriodFilter] = useState('month');

    const useFetchData = (endpoint) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          // Sử dụng axiosInstance thay vì fetch để tự động thêm token xác thực
          const response = await axiosInstance.get(`/admin/${endpoint}`);
          setData(response.data);
        } catch (err) {
          console.error(`Error fetching ${endpoint}:`, err);
          setError(err.response?.data?.error || err.message || `Failed to fetch ${endpoint} data`);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [endpoint]);

    return { data, loading, error };
  };

  // Sử dụng hook tùy chỉnh cho từng loại dữ liệu
  const { data: departments, loading: departmentsLoading, error: departmentsError } = useFetchData('departments');
  const { data: positions, loading: positionsLoading, error: positionsError } = useFetchData('positions');
  const { data: attendances, loading: attendancesLoading, error: attendancesError } = useFetchData('attendances');
  const { data: salaries, loading: salariesLoading, error: salariesError } = useFetchData('salaries');
  const { data: dividends, loading: dividendsLoading, error: dividendsError } = useFetchData('dividends');
  const { data: status, loading: statusLoading, error: statusError } = useFetchData('status');

  // Kiểm tra lỗi từ bất kỳ API nào
  const hasError = departmentsError || positionsError || attendancesError ||
                  salariesError || dividendsError || statusError;

  // Kiểm tra xem có đang tải dữ liệu từ bất kỳ API nào
  const isLoading = departmentsLoading || positionsLoading || attendancesLoading ||
                   salariesLoading || dividendsLoading || statusLoading;

  // Hiển thị thông báo lỗi nếu có
  if (hasError) {
    return (
      <div className="error-container">
        <p>Đã xảy ra lỗi khi tải dữ liệu:</p>
        <ul>
          {departmentsError && <li>Lỗi dữ liệu phòng ban: {departmentsError}</li>}
          {positionsError && <li>Lỗi dữ liệu vị trí: {positionsError}</li>}
          {attendancesError && <li>Lỗi dữ liệu điểm danh: {attendancesError}</li>}
          {salariesError && <li>Lỗi dữ liệu lương: {salariesError}</li>}
          {dividendsError && <li>Lỗi dữ liệu cổ tức: {dividendsError}</li>}
          {statusError && <li>Lỗi dữ liệu trạng thái: {statusError}</li>}
        </ul>
      </div>
    );
  }

  // Hiển thị trạng thái đang tải
  if (isLoading) {
    return <div className="loading">Đang tải dữ liệu...</div>;
  }


  // Sử dụng dữ liệu thực từ API
  // Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
  const fallbackDepartments = [
    { name: 'Engineering', employees: 45, budget: 450000, avgSalary: 100000 },
    { name: 'Marketing', employees: 20, budget: 180000, avgSalary: 90000 },
    { name: 'Sales', employees: 35, budget: 315000, avgSalary: 90000 },
    { name: 'Human Resources', employees: 15, budget: 120000, avgSalary: 80000 },
    { name: 'Finance', employees: 18, budget: 198000, avgSalary: 110000 },
  ];

  const fallbackPositions = [
    { name: 'Software Engineer', count: 30, avgSalary: 95000 },
    { name: 'Project Manager', count: 12, avgSalary: 110000 },
    { name: 'Marketing Specialist', count: 15, avgSalary: 85000 },
    { name: 'Sales Representative', count: 28, avgSalary: 75000 },
    { name: 'HR Coordinator', count: 8, avgSalary: 70000 },
  ];

  const fallbackAttendances = [
    { month: 'Jan', workDays: 22, absentDays: 2, leaveDays: 1 },
    { month: 'Feb', workDays: 20, absentDays: 1, leaveDays: 2 },
    { month: 'Mar', workDays: 23, absentDays: 3, leaveDays: 0 },
    { month: 'Apr', workDays: 21, absentDays: 1, leaveDays: 3 },
    { month: 'May', workDays: 22, absentDays: 2, leaveDays: 2 },
    { month: 'Jun', workDays: 21, absentDays: 0, leaveDays: 1 },
  ];

  const fallbackSalaries = [
    { month: 'Jan', baseSalary: 620000, bonus: 45000, deductions: 75000, netSalary: 590000 },
    { month: 'Feb', baseSalary: 620000, bonus: 30000, deductions: 73000, netSalary: 577000 },
    { month: 'Mar', baseSalary: 635000, bonus: 50000, deductions: 78000, netSalary: 607000 },
    { month: 'Apr', baseSalary: 635000, bonus: 40000, deductions: 77000, netSalary: 598000 },
    { month: 'May', baseSalary: 650000, bonus: 55000, deductions: 80000, netSalary: 625000 },
    { month: 'Jun', baseSalary: 650000, bonus: 60000, deductions: 82000, netSalary: 628000 },
  ];

  const fallbackDividends = [
    { month: 'Jan', amount: 120000 },
    { month: 'Feb', amount: 0 },
    { month: 'Mar', amount: 150000 },
    { month: 'Apr', amount: 0 },
    { month: 'May', amount: 180000 },
    { month: 'Jun', amount: 0 },
  ];

  const fallbackStatus = [
    { status: 'Active', count: 125 },
    { status: 'On Leave', count: 12 },
    { status: 'Contract', count: 18 },
    { status: 'Remote', count: 35 },
    { status: 'Probation', count: 10 },
  ];

  // Sử dụng dữ liệu từ API nếu có, nếu không thì sử dụng dữ liệu mẫu
  const departmentData = departments && departments.length > 0 ? departments : fallbackDepartments;
  const positionData = positions && positions.length > 0 ? positions : fallbackPositions;
  const attendanceData = attendances && attendances.length > 0 ? attendances : fallbackAttendances;
  const salaryData = salaries && salaries.length > 0 ? salaries : fallbackSalaries;
  const dividendData = dividends && dividends.length > 0 ? dividends : fallbackDividends;
  const statusData = status && status.length > 0 ? status : fallbackStatus;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="dashboard">
      <main className="container main-content">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="tab-icon">📊</span>
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'hr' ? 'active' : ''}`}
            onClick={() => setActiveTab('hr')}
          >
            <Users size={16} className="tab-icon" />
            HR Reports
          </button>
          <button
            className={`tab-button ${activeTab === 'payroll' ? 'active' : ''}`}
            onClick={() => setActiveTab('payroll')}
          >
            <DollarSign size={16} className="tab-icon" />
            Payroll Reports
          </button>
          <button
            className={`tab-button ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <Calendar size={16} className="tab-icon" />
            Attendance Reports
          </button>
          <button
            className={`tab-button ${activeTab === 'dividend' ? 'active' : ''}`}
            onClick={() => setActiveTab('dividend')}
          >
            <BarChart2 size={16} className="tab-icon" />
            Dividend Reports
          </button>
        </div>

        {/* Period Filter */}
        <div className="period-filter-container">
          <div className="period-filter">
            <button
              className={`filter-button ${periodFilter === 'month' ? 'active' : ''}`}
              onClick={() => setPeriodFilter('month')}
            >
              Month
            </button>
            <button
              className={`filter-button ${periodFilter === 'quarter' ? 'active' : ''}`}
              onClick={() => setPeriodFilter('quarter')}
            >
              Quarter
            </button>
            <button
              className={`filter-button ${periodFilter === 'year' ? 'active' : ''}`}
              onClick={() => setPeriodFilter('year')}
            >
              Year
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid-container">
            <div className="card">
              <h2 className="card-title">Employee Distribution by Department</h2>
              <PieChart width={400} height={300}>
                <Pie
                  data={departmentData}
                  cx={200}
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="employees"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            <div className="card">
              <h2 className="card-title">Employee Status Distribution</h2>
              <PieChart width={400} height={300}>
                <Pie
                  data={statusData}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="status"
                  label={({status, percent}) => `${status}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>

            <div className="card">
              <h2 className="card-title">Payroll Summary (Last 6 Months)</h2>
              <LineChart width={500} height={300} data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="baseSalary" stroke="#8884d8" name="Base Salary" />
                <Line type="monotone" dataKey="bonus" stroke="#82ca9d" name="Bonus" />
                <Line type="monotone" dataKey="netSalary" stroke="#ff7300" name="Net Salary" />
              </LineChart>
            </div>

            <div className="card">
              <h2 className="card-title">Attendance Overview (Last 6 Months)</h2>
              <BarChart width={500} height={300} data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="workDays" fill="#8884d8" name="Work Days" />
                <Bar dataKey="absentDays" fill="#ff8042" name="Absent Days" />
                <Bar dataKey="leaveDays" fill="#82ca9d" name="Leave Days" />
              </BarChart>
            </div>
          </div>
        )}

        {/* HR Tab */}
        {activeTab === 'hr' && (
          <div className="grid-container">
            <div className="card">
              <h2 className="card-title">Department Stats</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Employees</th>
                      <th>Budget</th>
                      <th>Avg. Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentData.map((dept, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                        <td>{dept.name}</td>
                        <td>{dept.employees}</td>
                        <td>${dept.budget.toLocaleString()}</td>
                        <td>${dept.avgSalary.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h2 className="card-title">Position Distribution</h2>
              <BarChart width={500} height={300} data={positionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Employee Count" />
              </BarChart>
            </div>

            <div className="card">
              <h2 className="card-title">Average Salary by Position</h2>
              <BarChart width={500} height={300} data={positionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgSalary" fill="#82ca9d" name="Average Salary" />
              </BarChart>
            </div>

            <div className="card">
              <h2 className="card-title">Employee Status</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statusData.map((item, index) => {
                      const total = statusData.reduce((sum, current) => sum + current.count, 0);
                      const percentage = ((item.count / total) * 100).toFixed(1);
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                          <td>{item.status}</td>
                          <td>{item.count}</td>
                          <td>{percentage}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payroll Tab */}
        {activeTab === 'payroll' && (
          <div className="grid-container">
            <div className="card">
              <h2 className="card-title">Salary Breakdown</h2>
              <LineChart width={500} height={300} data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="baseSalary" stroke="#8884d8" name="Base Salary" />
                <Line type="monotone" dataKey="bonus" stroke="#82ca9d" name="Bonus" />
                <Line type="monotone" dataKey="deductions" stroke="#ff8042" name="Deductions" />
              </LineChart>
            </div>

            <div className="card">
              <h2 className="card-title">Net Salary Trend</h2>
              <LineChart width={500} height={300} data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="netSalary" stroke="#8884d8" name="Net Salary" strokeWidth={2} />
              </LineChart>
            </div>

            <div className="card full-width">
              <h2 className="card-title">Detailed Payroll Report</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Base Salary</th>
                      <th>Bonus</th>
                      <th>Deductions</th>
                      <th>Net Salary</th>
                      <th>% Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryData.map((item, index) => {
                      const prevSalary = index > 0 ? salaryData[index - 1].netSalary : item.netSalary;
                      const percentChange = ((item.netSalary - prevSalary) / prevSalary * 100).toFixed(1);
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                          <td>{item.month}</td>
                          <td>${item.baseSalary.toLocaleString()}</td>
                          <td>${item.bonus.toLocaleString()}</td>
                          <td>${item.deductions.toLocaleString()}</td>
                          <td>${item.netSalary.toLocaleString()}</td>
                          <td>
                            <span className={index === 0 ? '' : (percentChange > 0 ? 'positive' : 'negative')}>
                              {index === 0 ? '-' : `${percentChange}%`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="grid-container">
            <div className="card">
              <h2 className="card-title">Attendance Overview</h2>
              <BarChart width={500} height={300} data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="workDays" fill="#8884d8" name="Work Days" />
                <Bar dataKey="absentDays" fill="#ff8042" name="Absent Days" />
                <Bar dataKey="leaveDays" fill="#82ca9d" name="Leave Days" />
              </BarChart>
            </div>

            <div className="card">
              <h2 className="card-title">Absence Rate</h2>
              <LineChart width={500} height={300} data={attendanceData.map(item => ({
                month: item.month,
                absenceRate: ((item.absentDays + item.leaveDays) / (item.workDays + item.absentDays + item.leaveDays) * 100).toFixed(1)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="absenceRate" stroke="#ff8042" name="Absence Rate (%)" />
              </LineChart>
            </div>

            <div className="card full-width">
              <h2 className="card-title">Detailed Attendance Report</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Work Days</th>
                      <th>Absent Days</th>
                      <th>Leave Days</th>
                      <th>Attendance Rate</th>
                      <th>Absence Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((item, index) => {
                      const totalDays = item.workDays + item.absentDays + item.leaveDays;
                      const attendanceRate = (item.workDays / totalDays * 100).toFixed(1);
                      const absenceRate = ((item.absentDays + item.leaveDays) / totalDays * 100).toFixed(1);
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                          <td>{item.month}</td>
                          <td>{item.workDays}</td>
                          <td>{item.absentDays}</td>
                          <td>{item.leaveDays}</td>
                          <td>{attendanceRate}%</td>
                          <td>{absenceRate}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Dividend Tab */}
        {activeTab === 'dividend' && (
          <div className="grid-container">
            <div className="card">
              <h2 className="card-title">Dividend Payments</h2>
              <BarChart width={500} height={300} data={dividendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Dividend Amount" />
              </BarChart>
            </div>

            <div className="card">
              <h2 className="card-title">Dividend Summary</h2>
              <div className="stats-grid">
                <div className="stats-item blue">
                  <h3 className="stats-title">Total Dividends</h3>
                  <p className="stats-value">${dividendData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</p>
                </div>
                <div className="stats-item green">
                  <h3 className="stats-title">Average Dividend</h3>
                  <p className="stats-value">
                    ${(dividendData.reduce((sum, item) => sum + item.amount, 0) / dividendData.filter(item => item.amount > 0).length).toLocaleString()}
                  </p>
                </div>
                <div className="stats-item purple">
                  <h3 className="stats-title">Last Dividend</h3>
                  <p className="stats-value">
                    ${dividendData.filter(item => item.amount > 0).slice(-1)[0]?.amount.toLocaleString() || 0}
                  </p>
                </div>
                <div className="stats-item yellow">
                  <h3 className="stats-title">Payment Frequency</h3>
                  <p className="stats-value">Bi-monthly</p>
                </div>
              </div>
            </div>

            <div className="card full-width">
              <h2 className="card-title">Detailed Dividend Report</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Dividend Amount</th>
                      <th>Status</th>
                      <th>% Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dividendData.map((item, index) => {
                      const prevDividends = dividendData.slice(0, index).filter(d => d.amount > 0);
                      const prevDividend = prevDividends.length > 0 ? prevDividends[prevDividends.length - 1].amount : item.amount;
                      const percentChange = item.amount > 0 && prevDividend > 0 ? ((item.amount - prevDividend) / prevDividend * 100).toFixed(1) : null;
                      return (
                        <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                          <td>{item.month}</td>
                          <td>${item.amount.toLocaleString()}</td>
                          <td>
                            <span className={item.amount > 0 ? 'status-paid' : 'status-none'}>
                              {item.amount > 0 ? 'Paid' : 'No Payment'}
                            </span>
                          </td>
                          <td>
                            {item.amount > 0 && percentChange !== null ? (
                              <span className={parseFloat(percentChange) >= 0 ? 'positive' : 'negative'}>
                                {percentChange}%
                              </span>
                            ) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}