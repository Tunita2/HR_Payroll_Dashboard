import React from 'react';

const PayrollDetails = ({ style = {} }) => {
  const summaryData = {
    totalIncome: '46.000.000',
    totalDeductions: '6.900.000',
    netSalary: '39.100.000'
  };

  const historyData = [
    { month: 'Tháng 12/2023', income: '46.000.000', deductions: '6.900.000', net: '39.100.000' },
    { month: 'Tháng 11/2023', income: '46.000.000', deductions: '6.900.000', net: '39.100.000' },
    { month: 'Tháng 10/2023', income: '46.000.000', deductions: '6.900.000', net: '39.100.000' },
    { month: 'Tháng 9/2023', income: '46.000.000', deductions: '6.900.000', net: '39.100.000' },
    { month: 'Tháng 8/2023', income: '46.000.000', deductions: '6.900.000', net: '39.100.000' }
  ];

  const containerStyle = {
    padding: '32px',
    minWidth: '100%',
    background: '#121843',
    borderRadius: '12px',
    boxSizing: 'border-box',
    ...style
  };

  const headerStyle = {
    marginBottom: '24px'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '16px'
  };

  const periodButtonsStyle = {
    display: 'flex',
    gap: '12px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    color: '#FFFFFF',
    border: 'none',
    cursor: 'pointer'
  };

  const summaryCardsStyle = {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    flexWrap: 'wrap'
  };

  const cardStyle = {
    flex: 1,
    background: '#30314A',
    borderRadius: '12px',
    padding: '24px',
    minWidth: '300px',
    boxSizing: 'border-box'
  };

  const cardLabelStyle = {
    fontSize: '16px',
    color: '#8E8EA3',
    marginBottom: '8px'
  };

  const cardValueStyle = {
    fontSize: '32px',
    fontWeight: 700,
  };

  const historyStyle = {
    background: '#30314A',
    borderRadius: '8px',
    overflow: 'hidden'
  };

  const tabsStyle = {
    display: 'flex',
    borderBottom: '1px solid #30314A'
  };

  const tabStyle = {
    padding: '12px 24px',
    color: '#FFFFFF',
    cursor: 'pointer',
    borderBottom: '2px solid transparent'
  };

  const activeTabStyle = {
    ...tabStyle,
    borderBottom: '2px solid #4A96FF'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const tableHeaderStyle = {
    background: '#30314A',
    padding: '16px',
    color: '#8E8EA3',
    textAlign: 'left'
  };

  const tableRowStyle = {
    borderBottom: '1px solid #30314A'
  };

  const tableCellStyle = {
    padding: '16px',
    background: '#30314A',
    color: '#FFFFFF'
  };

  const statusButtonStyle = {
    background: '#4A96FF',
    padding: '4px 12px',
    borderRadius: '4px',
    color: '#FFFFFF',
    border: 'none'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Chi Tiết Lương</h1>
        <div style={periodButtonsStyle}>
          <button style={{...buttonStyle, background: '#4A96FF'}}>Hàng Tháng</button>
          <button style={{...buttonStyle, background: '#30314A'}}>Cả Năm</button>
        </div>
      </div>

      <div style={summaryCardsStyle}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Tổng Thu Nhập</div>
          <div style={{...cardValueStyle, color: '#FFFFFF'}}>{summaryData.totalIncome} ₫</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Tổng Khấu Trừ</div>
          <div style={{...cardValueStyle, color: '#FF5151'}}>{summaryData.totalDeductions} ₫</div>
        </div>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Thực Lãnh</div>
          <div style={{...cardValueStyle, color: '#4A96FF'}}>{summaryData.netSalary} ₫</div>
        </div>
      </div>

      <div style={historyStyle}>
        <div style={tabsStyle}>
          <div style={activeTabStyle}>Thu Nhập & Khấu Trừ</div>
          <div style={tabStyle}>Lịch Sử Lương</div>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Tháng</th>
              <th style={tableHeaderStyle}>Tổng Thu Nhập</th>
              <th style={tableHeaderStyle}>Tổng Khấu Trừ</th>
              <th style={tableHeaderStyle}>Thực Lãnh</th>
              <th style={tableHeaderStyle}>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((row, index) => (
              <tr key={index} style={tableRowStyle}>
                <td style={tableCellStyle}>{row.month}</td>
                <td style={tableCellStyle}>{row.income} ₫</td>
                <td style={{...tableCellStyle, color: '#FF5151'}}>{row.deductions} ₫</td>
                <td style={{...tableCellStyle, color: '#4A96FF'}}>{row.net} ₫</td>
                <td style={tableCellStyle}>
                  <button style={statusButtonStyle}>Đã thanh toán</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollDetails;

