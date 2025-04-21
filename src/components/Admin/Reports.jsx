import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Users, DollarSign, BarChart2 } from 'lucide-react';
import '../../styles/AdminStyles/Reports.css';

// Custom hook for fetching data
const useFetchData = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/admin/${endpoint}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${endpoint} data`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [endpoint]);
  
  return { data, loading, error };
};

// Utility functions for data transformation
const dataTransformers = {
  calculatePercentChange: (current, previous) => {
    if (!previous) return null;
    return ((current - previous) / previous * 100).toFixed(1);
  },

  calculateRate: (value, total) => {
    return ((value / total) * 100).toFixed(1);
  },

  formatCurrency: (value) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
};

// Chart configuration constants
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Tab configuration
const TABS = [
  { id: 'overview', label: 'Overview', icon: <BarChart2 size={16} /> },
  { id: 'hr', label: 'HR Reports', icon: <Users size={16} /> },
  { id: 'payroll', label: 'Payroll Reports', icon: <DollarSign size={16} /> },
  { id: 'attendance', label: 'Attendance Reports', icon: <Calendar size={16} /> },
  { id: 'dividend', label: 'Dividend Reports', icon: <BarChart2 size={16} /> }
];

// Period filter options
const PERIOD_FILTERS = [
  { id: 'month', label: 'Month' },
  { id: 'quarter', label: 'Quarter' },
  { id: 'year', label: 'Year' }
];

const OverviewTab = ({ departmentChartData, statusData, salaries, attendances }) => (
  <div className="grid-container">
    <div className="card">
      <h2 className="card-title">Employee Distribution by Department</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={departmentChartData}
          cx={200}
          cy={150}
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="employees"
          nameKey="name"
          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {departmentChartData.map((_, index) => (
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
          {statusData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>

    <div className="card">
      <h2 className="card-title">Payroll Summary (Last 6 Months)</h2>
      <LineChart width={500} height={300} data={salaries}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => dataTransformers.formatCurrency(value)} />
        <Legend />
        <Line type="monotone" dataKey="baseSalary" stroke="#8884d8" name="Base Salary" />
        <Line type="monotone" dataKey="bonus" stroke="#82ca9d" name="Bonus" />
        <Line type="monotone" dataKey="netSalary" stroke="#ff7300" name="Net Salary" />
      </LineChart>
    </div>

    <div className="card">
      <h2 className="card-title">Attendance Overview (Last 6 Months)</h2>
      <BarChart width={500} height={300} data={attendances}>
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
);

const HRTab = ({ departmentChartData, positionChartData, statusData }) => (
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
            {departmentChartData.map((dept, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                <td>{dept.name}</td>
                <td>{dept.employees}</td>
                <td>{dataTransformers.formatCurrency(dept.budget)}</td>
                <td>{dataTransformers.formatCurrency(dept.avgSalary)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="card">
      <h2 className="card-title">Position Distribution</h2>
      <BarChart width={500} height={300} data={positionChartData}>
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
      <BarChart width={500} height={300} data={positionChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => dataTransformers.formatCurrency(value)} />
        <Legend />
        <Bar dataKey="avgSalary" fill="#82ca9d" name="Average Salary" />
      </BarChart>
    </div>
  </div>
);

const PayrollTab = ({ salaryChartData }) => (
  <div className="grid-container">
    <div className="card">
      <h2 className="card-title">Salary Breakdown</h2>
      <LineChart width={500} height={300} data={salaryChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => dataTransformers.formatCurrency(value)} />
        <Legend />
        <Line type="monotone" dataKey="baseSalary" stroke="#8884d8" name="Base Salary" />
        <Line type="monotone" dataKey="bonus" stroke="#82ca9d" name="Bonus" />
        <Line type="monotone" dataKey="deductions" stroke="#ff8042" name="Deductions" />
      </LineChart>
    </div>

    <div className="card">
      <h2 className="card-title">Net Salary Trend</h2>
      <LineChart width={500} height={300} data={salaryChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => dataTransformers.formatCurrency(value)} />
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
            {salaryChartData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                <td>{item.month}</td>
                <td>{dataTransformers.formatCurrency(item.baseSalary)}</td>
                <td>{dataTransformers.formatCurrency(item.bonus)}</td>
                <td>{dataTransformers.formatCurrency(item.deductions)}</td>
                <td>{dataTransformers.formatCurrency(item.netSalary)}</td>
                <td>
                  <span className={index === 0 ? '' : (item.percentChange > 0 ? 'positive' : 'negative')}>
                    {index === 0 ? '-' : `${item.percentChange}%`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const AttendanceTab = ({ attendanceChartData }) => (
  <div className="grid-container">
    <div className="card">
      <h2 className="card-title">Attendance Overview</h2>
      <BarChart width={500} height={300} data={attendanceChartData}>
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
      <LineChart width={500} height={300} data={attendanceChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="absenceRate" 
          stroke="#ff8042" 
          name="Absence Rate (%)" 
        />
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
            </tr>
          </thead>
          <tbody>
            {attendanceChartData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                <td>{item.month}</td>
                <td>{item.workDays}</td>
                <td>{item.absentDays}</td>
                <td>{item.leaveDays}</td>
                <td>{item.attendanceRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const DividendTab = ({ dividendChartData }) => {
  const totalDividends = useMemo(() => 
    dividendChartData.reduce((sum, item) => sum + item.amount, 0),
    [dividendChartData]
  );

  const averageDividend = useMemo(() => {
    const paidDividends = dividendChartData.filter(item => item.amount > 0);
    return paidDividends.length > 0 ? 
      totalDividends / paidDividends.length : 
      0;
  }, [dividendChartData, totalDividends]);

  const lastDividend = useMemo(() => 
    dividendChartData.filter(item => item.amount > 0).slice(-1)[0]?.amount || 0,
    [dividendChartData]
  );

  return (
    <div className="grid-container">
      <div className="card">
        <h2 className="card-title">Dividend Payments</h2>
        <BarChart width={500} height={300} data={dividendChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => dataTransformers.formatCurrency(value)} />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" name="Dividend Amount" />
        </BarChart>
      </div>

      <div className="card">
        <h2 className="card-title">Dividend Summary</h2>
        <div className="stats-grid">
          <div className="stats-item blue">
            <h3 className="stats-title">Total Dividends</h3>
            <p className="stats-value">
              {dataTransformers.formatCurrency(totalDividends)}
            </p>
          </div>
          <div className="stats-item green">
            <h3 className="stats-title">Average Dividend</h3>
            <p className="stats-value">
              {dataTransformers.formatCurrency(averageDividend)}
            </p>
          </div>
          <div className="stats-item purple">
            <h3 className="stats-title">Last Dividend</h3>
            <p className="stats-value">
              {dataTransformers.formatCurrency(lastDividend)}
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
              {dividendChartData.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even-row' : ''}>
                  <td>{item.month}</td>
                  <td>{dataTransformers.formatCurrency(item.amount)}</td>
                  <td>
                    <span className={item.amount > 0 ? 'status-paid' : 'status-none'}>
                      {item.amount > 0 ? 'Paid' : 'No Payment'}
                    </span>
                  </td>
                  <td>
                    {item.amount > 0 && item.percentChange !== null ? (
                      <span className={parseFloat(item.percentChange) >= 0 ? 'positive' : 'negative'}>
                        {item.percentChange}%
                      </span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [periodFilter, setPeriodFilter] = useState('month');
  
  // Fetch data using custom hook
  const { 
    data: departments, 
    loading: departmentsLoading, 
    error: departmentsError 
  } = useFetchData('departments');
  
  const { 
    data: positions, 
    loading: positionsLoading, 
    error: positionsError 
  } = useFetchData('positions');
  
  const { 
    data: attendances, 
    loading: attendancesLoading, 
    error: attendancesError 
  } = useFetchData('attendances');
  
  const { 
    data: salaries, 
    loading: salariesLoading, 
    error: salariesError 
  } = useFetchData('salaries');
  
  const { 
    data: dividends, 
    loading: dividendsLoading, 
    error: dividendsError 
  } = useFetchData('dividends');
  
  const { 
    data: status, 
    loading: statusLoading, 
    error: statusError 
  } = useFetchData('status');

  // Derived states using useMemo
  const isLoading = useMemo(() => {
    return departmentsLoading || positionsLoading || attendancesLoading ||
           salariesLoading || dividendsLoading || statusLoading;
  }, [departmentsLoading, positionsLoading, attendancesLoading,
      salariesLoading, dividendsLoading, statusLoading]);

  const hasError = useMemo(() => {
    return departmentsError || positionsError || attendancesError || 
           salariesError || dividendsError || statusError;
  }, [departmentsError, positionsError, attendancesError,
      salariesError, dividendsError, statusError]);

  // Process data for charts
  const departmentChartData = useMemo(() => {
    return departments.map(dept => ({
      name: dept.name,
      employees: dept.employees,
      budget: dept.budget,
      avgSalary: dept.avgSalary
    }));
  }, [departments]);

  const positionChartData = useMemo(() => {
    return positions.map(pos => ({
      name: pos.name,
      count: pos.count,
      avgSalary: pos.avgSalary
    }));
  }, [positions]);

  const attendanceChartData = useMemo(() => {
    return attendances.map(att => ({
      month: att.month,
      workDays: att.workDays,
      absentDays: att.absentDays,
      leaveDays: att.leaveDays,
      attendanceRate: dataTransformers.calculateRate(
        att.workDays,
        att.workDays + att.absentDays + att.leaveDays
      )
    }));
  }, [attendances]);

  const salaryChartData = useMemo(() => {
    return salaries.map((salary, index) => {
      const prevSalary = index > 0 ? salaries[index - 1].netSalary : salary.netSalary;
      return {
        month: salary.month,
        baseSalary: salary.baseSalary,
        bonus: salary.bonus,
        deductions: salary.deductions,
        netSalary: salary.netSalary,
        percentChange: dataTransformers.calculatePercentChange(salary.netSalary, prevSalary)
      };
    });
  }, [salaries]);

  const dividendChartData = useMemo(() => {
    return dividends.map((dividend, index) => {
      const prevDividends = dividends.slice(0, index).filter(d => d.amount > 0);
      const prevDividend = prevDividends.length > 0 ? 
        prevDividends[prevDividends.length - 1].amount : 
        dividend.amount;
      
      return {
        month: dividend.month,
        amount: dividend.amount,
        percentChange: dataTransformers.calculatePercentChange(dividend.amount, prevDividend)
      };
    });
  }, [dividends]);

  if (hasError) {
    return (
      <div className="error-container">
        <h3>Error Loading Data</h3>
        <ul>
          {departmentsError && <li>Departments: {departmentsError}</li>}
          {positionsError && <li>Positions: {positionsError}</li>}
          {attendancesError && <li>Attendance: {attendancesError}</li>}
          {salariesError && <li>Salaries: {salariesError}</li>}
          {dividendsError && <li>Dividends: {dividendsError}</li>}
          {statusError && <li>Status: {statusError}</li>}
        </ul>
      </div>
    );
  }

  if (isLoading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard">
      <main className="container main-content">
        {/* Tabs */}
        <div className="tabs">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Period Filter */}
        <div className="period-filter-container">
          <div className="period-filter">
            {PERIOD_FILTERS.map(filter => (
              <button 
                key={filter.id}
                className={`filter-button ${periodFilter === filter.id ? 'active' : ''}`}
                onClick={() => setPeriodFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab 
            departmentChartData={departmentChartData}
            statusData={status}
            salaries={salaryChartData}
            attendances={attendanceChartData}
          />
        )}

        {activeTab === 'hr' && (
          <HRTab 
            departmentChartData={departmentChartData}
            positionChartData={positionChartData}
            statusData={status}
          />
        )}

        {activeTab === 'payroll' && (
          <PayrollTab 
            salaryChartData={salaryChartData}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTab 
            attendanceChartData={attendanceChartData}
          />
        )}

        {activeTab === 'dividend' && (
          <DividendTab 
            dividendChartData={dividendChartData}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;