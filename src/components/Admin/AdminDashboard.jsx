import React from 'react';
import "../../styles/AdminStyles/AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="dashboard-title-container">
      <div className="dashboard-description">
        <div><strong>Dashboard</strong></div>

        <div>
          <strong>Employee</strong>
          <div>Employees - Displays employee details</div>
          <div>Dividends - Displays employee dividend information</div>
        </div>

        <div>
          <strong>Departments</strong> - Displays list of departments
        </div>

        <div>
          <strong>Positions</strong> - Displays available job positions
        </div>

        <div>
          <strong>Payroll</strong>
          <div>Salaries - Displays salary information</div>
          <div>Attendances - Displays attendance records</div>
          <div>Schedules - Displays employee work schedules</div>
        </div>

        <div>
          <strong>Reports</strong> - Displays human resources and payroll reports
        </div>

        <div>
          <strong>Alerts & Notifications</strong> - Displays important alerts and messages
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
