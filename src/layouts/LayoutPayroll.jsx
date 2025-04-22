import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/General/Header';
import Sidebar from '../components/General/Sidebar';
import { menuConfig, settingItems } from '../components/Payroll/PayrollConfig';
import '../styles/GeneralStyles/Layout.css';

const LayoutPayroll = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { pathname } = useLocation();
  const theme = useTheme();
  
  // Get current page title from menu config
  const currentPage = [...menuConfig, ...settingItems].find(
    item => item.path === pathname || pathname.startsWith(item.path + '/')
  );
  
  const pageTitle = currentPage?.text || 'Payroll Management';
  
  // In a real app, these would come from your auth context
  const userName = "John Smith";
  const userRole = "Payroll Officer";

  const handleMenuClick = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="layout-container" style={{ backgroundColor: theme.colors.background }}>
      <Sidebar
        isOpen={isSidebarOpen}
        menuItems={menuConfig}
        settingItems={settingItems}
        onToggle={handleMenuClick}
        currentPath={pathname}
      />
      
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Header
          title={pageTitle}
          onMenuClick={handleMenuClick}
          userName={userName}
          userRole={userRole}
        />
        
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutPayroll;
