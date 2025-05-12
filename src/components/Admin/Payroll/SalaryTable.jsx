import { useEffect, useState } from 'react';
import AdminSalaryTable from "./AdminSalaryTable";
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const SalaryTable = () => {
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

    // Check if the payroll API endpoint is accessible
    const checkApiAccess = async () => {
      try {
        // Test call to verify payroll API access
        await axiosInstance.get('/payroll/salaries');
        setIsApiAccessible(true);
      } catch (error) {
        console.error("Payroll API access error:", error);
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
        <div className='main-title'>Salary list</div>
        <div className="loading" style={{ padding: '20px', textAlign: 'center' }}>
          <p>Loading salary data...</p>
        </div>
      </div>
    );
  }

  // If API is not accessible, show error message
  if (!isApiAccessible) {
    return (
      <div>
        <div className='main-title'>Salary list</div>
        <div className="error-message" style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
          <p>Error: Unable to access salary data. Please check your permissions or contact the administrator.</p>
        </div>
      </div>
    );
  }

  // If API is accessible, render the AdminSalaryTable component
  return (
    <AdminSalaryTable />
  );
};

export default SalaryTable;
