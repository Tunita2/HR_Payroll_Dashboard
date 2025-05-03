import React from 'react';
import '../../styles/GeneralStyles/Header.css';
import SearchBar from './SearchBar';

const Header = ({ userName = 'Tuan', userRole = 'Payroll manager' }) => {
  return (
    <div className="header-container">
      <div className="header-background">
        <div className="header-content">
          {/* <SearchBar></SearchBar> */}
          <div className="notification-section">
            <div className="icon-wrapper">
              <img src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/ic-round.png" alt="notifications" className="icon" />
            </div>
            <div className="icon-wrapper">
              <img src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/bi-chat.png" alt="chat" className="icon" />
            </div>
            
            {/* User Info */}
            <div className="user-info">
              <img src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/ellipse.png" alt="user" className="user-avatar" />
              <div className="user-name-wrapper">
                <span className="user-greeting">Hi, {userName}</span>
                <img src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/frame-10.png" alt="dropdown" className="dropdown-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

