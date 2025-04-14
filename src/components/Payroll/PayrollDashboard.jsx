import React from 'react';
import '../../styles/PayrollStyles/dashboard.css'

const Payroll = () => {
  return (
    <div className="dashboard-titles-container">
      <div>Dashboard</div>

      <div>
        <div>Salary - Displays Salary details</div>
        <div>Attendance - Displays available Attendance</div>
        <div>Schedule - Displays available Schedule</div>
        <div>Report - Displays a summary report on Payroll.</div>
      </div>
    </div>
  );
};

export default Payroll;