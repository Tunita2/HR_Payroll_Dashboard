import React from 'react';
import Header from '../../../components/Header';
import SidebarMenu from '../../../components/Sidebar';
import LeaveStatusSection_LeaveApplicationSection_QuickActions from './LeaveStatusSection_LeaveApplicationSection_QuickActions';

const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', background: 'linear-gradient(116.82deg, rgba(10,0,126,1) 0%, rgba(255,255,255,1) 100%)' }}>
      {/* Header */}
      <div style={{ flex: '0 0 auto' }}>
        <Header />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
        {/* Sidebar Menu */}
        <div style={{ flex: '0 0 210px', height: 'auto' }}>
          <SidebarMenu />
        </div>

        {/* Main Content */}
        <div style={{ flexGrow: 1, padding: '20px', backgroundColor: '#1A1A40' }}>
          <LeaveStatusSection_LeaveApplicationSection_QuickActions />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

