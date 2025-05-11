import React, { useEffect, useState } from 'react';
import PayrollAttendanceTable from "../../Payroll/AttendanceTable";
import axiosInstance from '../axiosInstance';

const AttendanceTable = () => {
  // Initialize state to track if API is accessible
  const [isApiAccessible, setIsApiAccessible] = useState(true);

  useEffect(() => {
    // Check if the admin API endpoint is accessible
    const checkApiAccess = async () => {
      try {
        // Test call to verify admin API access
        await axiosInstance.get('/admin/attendances');
        setIsApiAccessible(true);
      } catch (error) {
        console.error("Admin API access error:", error);
        setIsApiAccessible(false);
      }
    };

    checkApiAccess();
  }, []);

  // If API is not accessible, show error message
  if (!isApiAccessible) {
    return (
      <div>
        <div className='main-title'>Attendance list</div>
        <div className="error-message" style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
          <p>Error: Unable to access attendance data. Please check your permissions or contact the administrator.</p>
        </div>
      </div>
    );
  }

  // If API is accessible, render the PayrollAttendanceTable component
  return (
    <PayrollAttendanceTable />
  );
};

export default AttendanceTable;