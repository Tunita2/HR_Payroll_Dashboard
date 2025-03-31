import React from 'react';
import '../../styles/MainDashboard/TabBar.css';

const TabBar = ({ style = {} }) => {
  return (
    <div className="tab-bar" style={style}>
      <div className="tab-bar-content">
        <div className="notification-section">
          <div className="icon-wrapper">
            <img src="https://dashboard.codeparrot.ai/api/image/Z-PATt4gt92eP1ZG/ic-round.png" alt="notifications" className="icon" />
          </div>
          <div className="icon-wrapper">
            <img src="https://dashboard.codeparrot.ai/api/image/Z-PATt4gt92eP1ZG/bi-chat.png" alt="chat" className="icon" />
          </div>
          <div className="user-info">
            <img src="https://dashboard.codeparrot.ai/api/image/Z-PATt4gt92eP1ZG/ellipse.png" alt="user" className="user-avatar" />
            <div className="user-name">Hi, Minh</div>
          </div>
        </div>
        <div className="role-title">HR manager</div>
      </div>
    </div>
  );
};

export default TabBar;
