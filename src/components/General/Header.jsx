import React from 'react';
import { FaBars, FaUserCircle, FaBell } from 'react-icons/fa';
import '../../styles/GeneralStyles/Header.css';

const Header = ({ title, onMenuClick, userName, userRole }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <FaBars />
        </button>
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-right">
        <div className="header-date">
          {currentDate}
        </div>

        <button className="notification-button">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile">
          <FaUserCircle className="user-avatar" />
          <div className="user-info">
            <div className="user-name">{userName}</div>
            <div className="user-role">{userRole}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

