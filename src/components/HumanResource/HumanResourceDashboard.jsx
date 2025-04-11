import React from 'react';

const DashboardTitle = ({ style = {} }) => {
  return (
    <div className="dashboard-title" style={style}>
      <h1>Dashboard</h1>
    </div>
  );
};

export default DashboardTitle;