import React from 'react';
import Header from '../../../components/Header';
import Footer_SidebarMenu from '../../../components/Sidebar';
import UpcomingEvents_YearSelector_Statistics from './UpcomingEvents_YearSelector_Statistics';

const EmployeeDashboardLayout = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(116.82deg, rgba(10,0,126,1) 0%, rgba(255,255,255,1) 100%)',
      padding: '20px'
    }}>
      <Header />
      <div style={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'row',
        padding: '20px',
        gap: '20px'
      }}>
        <Footer_SidebarMenu />
        <UpcomingEvents_YearSelector_Statistics />
      </div>
    </div>
  );
};

export default EmployeeDashboardLayout;

