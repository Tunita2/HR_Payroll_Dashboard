import React from 'react';
import Header from '../../../components/Header';
import SidebarMenu from '../../../components/Sidebar';
import PayrollDetails from './PayrollDetails';

const Layout = () => {
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
        height: '90px'
      }} />
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexGrow: 1
      }}>
        <SidebarMenu style={{
          flexGrow: 0,
          width: '210px',
          minHeight: '100vh'
        }} />
        <PayrollDetails style={{
          flexGrow: 1,
          height: 'auto',
          padding: '32px'
        }} />
      </div>
    </div>
  );
};

export default Layout;

