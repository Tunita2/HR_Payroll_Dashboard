import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSchedules from './AdminSchedules';
import axiosInstance from '../axiosInstance';

const Schedules = () => {
  // Initialize state to track if API is accessible
  const [isApiAccessible, setIsApiAccessible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if no token
      navigate('/login');
      return;
    }

    // Check if the API endpoint is accessible
    const checkApiAccess = async () => {
      try {
        // Test call to verify API access
        await axiosInstance.get('/payroll/employees');
        setIsApiAccessible(true);
      } catch (error) {
        console.error("API access error:", error);
        setIsApiAccessible(false);

        // If error is 401 Unauthorized, redirect to login
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token'); // Clear invalid token
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkApiAccess();
  }, [navigate]);

  // Show loading while checking API access
  if (isLoading) {
    return (
      <div>
        <div className='main-title'>Schedule Management</div>
        <div className="loading" style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading schedule data...</p>
        </div>
      </div>
    );
  }

  // If API is not accessible, show error message
  if (!isApiAccessible) {
    return (
      <div>
        <div className='main-title'>Schedule Management</div>
        <div className="error-message" style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
          <p>Error: Unable to access schedule data. Please check your permissions or contact the administrator.</p>
        </div>
      </div>
    );
  }

  // If API is accessible, render the AdminSchedules component
  return (
    <AdminSchedules />
  );
};

export default Schedules;
