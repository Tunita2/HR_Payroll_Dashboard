import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h1 className="sidebar-title">Payroll</h1>
      
      <div className="menu-container">
        {/* Dashboard */}
        <div className="menu-item">
          <img src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/vector.png" alt="Dashboard" className="menu-icon" />
          <span>Dashboard</span>
        </div>

        {/* Payroll Management */}
        <div className="menu-item active">
          <img src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/financia.png" alt="Payroll" className="menu-icon" />
          <span>Payroll management</span>
        </div>

        {/* Attendance */}
        <div className="menu-item">
          <img src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/name-tag.png" alt="Attendance" className="menu-icon" />
          <span>Attendance</span>
        </div>

        {/* Schedule */}
        <div className="menu-item">
          <img src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/time-lim.png" alt="Schedule" className="menu-icon" />
          <span>Schedule</span>
        </div>

        {/* Work Status */}
        <div className="menu-item">
          <img src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/people.png" alt="Work Status" className="menu-icon" />
          <span>Work status</span>
        </div>

        {/* Report */}
        <div className="menu-item">
          <img src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/document.png" alt="Report" className="menu-icon" />
          <span>Report</span>
        </div>
      </div>

      <div className="bottom-menu">
        {/* Account */}
        <div className="menu-item">
          <img src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/vector-2.png" alt="Account" className="menu-icon" />
          <span>Account</span>
        </div>

        {/* Settings */}
        <div className="menu-item">
          <img src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/vector-3.png" alt="Settings" className="menu-icon" />
          <span>Setting</span>
        </div>
      </div>
    </div>
  );
};

Sidebar.defaultProps = {
  // Add any default props if needed
};

export default Sidebar;