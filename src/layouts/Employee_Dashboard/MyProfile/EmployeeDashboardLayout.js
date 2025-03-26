import React from 'react';
import Header from '../../../components/Header';
import SidebarMenu from '../../../components/Sidebar';
import ProfileDetails from './ProfileDetails';

const EmployeeDashboardLayout = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(116.82deg, rgba(10,0,126,1) 0%, rgba(255,255,255,1) 100%)'
    }}>
      <Header style={{
        flexGrow: 0,
        height: '90px',
        width: '100%',
        minWidth: '1230px',
      }} />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1,
        width: '100%',
      }}>
        <SidebarMenu style={{
          flexGrow: 0,
          width: '210px',
          height: 'auto',
        }} />
        <ProfileDetails style={{
          flexGrow: 1,
          width: 'auto',
          height: 'auto',
          maxWidth: '1146px',
          margin: '0 auto',
        }} />
      </div>
    </div>
  );
};

export default EmployeeDashboardLayout;

