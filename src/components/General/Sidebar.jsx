import React from 'react';
import { FaBars } from 'react-icons/fa';
import '../../styles/GeneralStyles/Sidebar.css';

const Sidebar = ({
  menuItems,
  settingItems,
  isOpen,
  onToggle,
  onNavigate,
  currentPath,
  userRole
}) => {
  const handleNavClick = (path) => {
    if (path) {
      onNavigate(path);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">HR Payroll</h2>
        <button className="toggle-button" onClick={onToggle}>
          <FaBars />
        </button>
      </div>

      <nav className="sidebar-nav">
        {/* Main Menu Items */}
        <div className="nav-section">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath.includes(item.path);
            
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                <Icon className="nav-icon" />
                <span className="nav-text">{item.text}</span>
                {isOpen && (
                  <span className="nav-description">{item.description}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Settings Items */}
        <div className="nav-section settings">
          {settingItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                <Icon className="nav-icon" />
                <span className="nav-text">{item.text}</span>
                {isOpen && (
                  <span className="nav-description">{item.description}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      {isOpen && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-role">{userRole}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
