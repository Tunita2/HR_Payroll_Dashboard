import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Table from '../layouts/table/TableLayout'

const PayrollView = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", minHeight: '100vh', background: 'linear-gradient(116.82deg, rgb(21,14,95) 1%, rgb(20,10,88) 22%, rgb(42,27,130) 28%, rgb(182,174,206) 100%)' }}>
      {/* Sidebar */}
      <div style={{ flexGrow: 0, flexShrink: 0, flexBasis: '210px', height: 'auto' }}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: 'auto' }}>
        {/* Header */}
        <div style={{height: 'auto' }}>
          <Header />
        </div>

        {/* Payroll Table */}
        <div style={{ flexGrow: 1, height: 'auto', padding: '30px 20px 0 40px'}}>
          <Table></Table>
        </div>
      </div>
    </div>
  );
};


export default PayrollView;

