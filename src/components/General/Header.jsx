import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/GeneralStyles/Header.css';
import SearchBar from './SearchBar';
import { useTheme } from '../../context/ThemeContext';
import { FaMoon, FaSun, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Header = ({ userName = 'Tuan', userRole = 'Payroll manager' }) => {
  const [showProfile, setShowProfile] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage or your auth state
    localStorage.removeItem('user');
    // Redirect to login
    navigate('/login');
  };

  return (
    <div className={`header-container ${isDarkMode ? 'dark' : ''}`}>
      <div className="header-background">
        <div className="header-content">
          <SearchBar />
          <div className="notification-section">
            <button 
              className="theme-toggle"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Profile Section */}
            <div className="profile-section">
              <div 
                className="user-info"
                onClick={() => setShowProfile(!showProfile)}
              >
                <img 
                  src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/ellipse.png" 
                  alt="user" 
                  className="user-avatar" 
                />
                <div className="user-details">
                  <span className="user-greeting">Hi, {userName}</span>
                  <span className="user-role">{userRole}</span>
                </div>
              </div>

              {showProfile && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <img 
                      src="https://dashboard.codeparrot.ai/api/image/Z-Evp2s0ZhD5c3df/ellipse.png" 
                      alt="user" 
                      className="dropdown-avatar" 
                    />
                    <div className="dropdown-user-info">
                      <span className="dropdown-name">{userName}</span>
                      <span className="dropdown-role">{userRole}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button onClick={() => navigate('/profile')} className="dropdown-item">
                    <FaUser /> My Profile
                  </button>
                  <button onClick={() => navigate('/settings')} className="dropdown-item">
                    <FaCog /> Settings
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

