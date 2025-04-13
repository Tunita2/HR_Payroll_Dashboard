import React from 'react';
import "../../styles/HumanResourceStyles/HR_MainDashboard.css"


const HR_MainDashboard = ({ style = {} }) => {
  return (
    <div className="dashboard-title-container" style={style}>
      <div className = "title">Dashboard</div>

      <div className = "dashboard-description">
          <div className = "employee">Employee - Displays employee details</div>
          <div className = "position">Position - Displays available positions</div>
          <div className = "department">Department - Displays available departments</div>
          <div className = "dividend">Dividend - Displays available dividend</div>
          <div className = "report">Report - Displays a summary report on human resources.</div>
      </div>
    </div>
  );
};

export default HR_MainDashboard;
