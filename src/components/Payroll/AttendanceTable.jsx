import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../styles/PayrollStyles/tableAttendance.css";
import SearchForPayroll from '../General/SearchForPayroll';

const AttendanceTable = () => {
  const [dataAttendance, setAttendance] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState("FullName")
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/payroll/attendance');
        const sortedData = res.data.sort((a, b) => a.AttendanceID - b.AttendanceID);
        setAttendance(sortedData);
      } catch (err) {
        console.error("Failed to fetch attendance data", err);
      }
    };
    fetchAttendance();
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
    new Set(dataAttendance.map((item) => getMonthYear(item.AttendanceMonth)))
  );

  const searchCategories = [
    { value: "FullName", label: "Name" },
    { value: "EmployeeID", label: "Employee ID" },
    { value: "DepartmentName", label: "Department" },
    { value: "PositionName", label: "Position" }
  ];

  const filteredData = dataAttendance
    .filter(item => selectedMonth === "all" || getMonthYear(item.AttendanceMonth) === selectedMonth)
    .filter(item => {
      if (!searchQuery) return true;

      const searchValue = String(item[searchCategory] || "").toLowerCase();
      return searchValue.includes(searchQuery.toLowerCase());
    });

  return (
    <div>
      <div className='main-title'>Attendance list</div>
      <div className="appli-table-header">
        <SearchForPayroll
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchCategory={searchCategory}
          setSearchCategory={setSearchCategory}
          categories={searchCategories}
          placeholder="Search attendance records..."
        />
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
                <th>Work Days</th>
                <th>Absent Days</th>
                <th>Leave Days</th>
                <th>Attendance Month</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((employee, index) => (
                <tr key={index} className="appli-table-row">
                  <td>{employee.AttendanceID}</td>
                  <td>{employee.EmployeeID}</td>
                  <td>{employee.FullName}</td>
                  <td>{employee.DepartmentName}</td>
                  <td>{employee.PositionName}</td>
                  <td>{employee.WorkDays}</td>
                  <td>{employee.AbsentDays}</td>
                  <td>{employee.LeaveDays}</td>
                  <td>{formatDate(employee.AttendanceMonth)}</td>
                  <td>{formatDate(employee.CreatedAt)}</td>
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

export default AttendanceTable;
