import React, { useState, useEffect } from 'react';
import { FaSearch, FaFileDownload, FaPlus, FaFilter } from 'react-icons/fa';
import { attendanceRecords } from '../../lib/mock-data';
import { formatDate, formatTime, getStatusColor } from '../../lib/utils';
import SearchBar from '../General/SearchBar';
import "../../styles/PayrollStyles/tableAttendance.css";

const AttendanceTable = () => {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchAttendanceData = () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        setRecords(attendanceRecords);
      } catch (err) {
        setError('Failed to fetch attendance data');
        console.error('Error fetching attendance data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const filteredRecords = records.filter(record =>
    Object.values(record).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting attendance data...');
  };

  const handleNewRecord = () => {
    // Implement new record functionality
    console.log('Creating new attendance record...');
  };

  if (loading) return <div className="loading">Loading attendance data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="attendance-table-container">
      <div className="table-header">
        <div className="header-left">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search attendance records..."
          />
          <div className="date-filter">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="date-input"
            />
            <button className="filter-button">
              <FaFilter /> Filter
            </button>
          </div>
        </div>
        
        <div className="header-right">
          <button className="action-button" onClick={handleExport}>
            <FaFileDownload /> Export
          </button>
          <button className="action-button primary" onClick={handleNewRecord}>
            <FaPlus /> New Record
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total Hours</th>
              <th>Overtime</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.employeeId}</td>
                <td>{formatDate(record.date)}</td>
                <td>{formatTime(record.checkIn)}</td>
                <td>{formatTime(record.checkOut)}</td>
                <td>{record.totalHours}</td>
                <td>{record.overtime}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(record.status) }}
                  >
                    {record.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-button">Edit</button>
                    <button className="view-button">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="pagination">
          <button className="pagination-button" disabled>Previous</button>
          <span className="pagination-info">Page 1 of 1</span>
          <button className="pagination-button" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;