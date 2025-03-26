import React from 'react';
import Header_SearchBar from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import NotificationList from './NotificationList';

const DashboardLayout = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(116.82deg, rgba(10,0,126,1) 0%, rgba(255,255,255,1) 100%)'
    }}>
      <Header_SearchBar style={{
        flexGrow: 0,
        height: '90px'
      }} />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1
      }}>
        <Sidebar style={{
          flexGrow: 0,
          width: '208px',
          background: 'rgba(3, 0, 89, 0.87)',
          padding: '20px 0'
        }} />
        <div style={{
          flexGrow: 1,
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          margin: '20px'
        }}>
          <h2 style={{
            color: '#FFFFFF',
            fontFamily: 'Poppins',
            fontSize: '24px',
            fontWeight: 500,
            marginBottom: '20px'
          }}>Thông Báo</h2>
          <NotificationList />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

