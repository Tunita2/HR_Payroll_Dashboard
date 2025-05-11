import React, { useEffect, useState } from 'react';
import PayrollHistory from "../../Payroll/History";
import axiosInstance from '../axiosInstance';

const History = () => {
  // Initialize state to track if API is accessible
  const [isApiAccessible, setIsApiAccessible] = useState(true);

  useEffect(() => {
    // Check if the payroll API endpoint is accessible
    const checkApiAccess = async () => {
      try {
        // Test call to verify payroll API access
        await axiosInstance.get('/payroll/salaries');
        setIsApiAccessible(true);
      } catch (error) {
        console.error("Payroll API access error:", error);
        setIsApiAccessible(false);
      }
    };

    checkApiAccess();
  }, []);

  // If API is not accessible, show error message
  if (!isApiAccessible) {
    return (
      <div>
        <div className='main-title'>Salary History</div>
        <div className="error-message" style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
          <p>Error: Unable to access salary history data. Please check your permissions or contact the administrator.</p>
        </div>
      </div>
    );
  }

  // If API is accessible, render the PayrollHistory component
  return (
    <PayrollHistory />
  );
};

export default History;
