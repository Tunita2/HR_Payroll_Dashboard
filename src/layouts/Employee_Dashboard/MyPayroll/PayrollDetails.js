import React from 'react';

const PayrollDetails = ({ style }) => {
  const cardStyle = {
    background: '#30314A',
    borderRadius: '12px',
    padding: '24px',
    color: '#FFFFFF',
    width: '100%',
    maxWidth: '342px',
    height: '176px',
    boxSizing: 'border-box'
  };

  const rowItemStyle = {
    background: '#30314A',
    borderRadius: '8px',
    padding: '16px',
    color: '#FFFFFF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    height: '56px',
    boxSizing: 'border-box'
  };

  const tabStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontFamily: 'Poppins',
    border: 'none',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      padding: '32px',
      minWidth: '100%',
      maxWidth: '1138px',
      background: '#121843',
      borderRadius: '12px',
      boxSizing: 'border-box',
      ...style
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <h1 style={{
          color: '#FFFFFF',
          fontSize: '24px',
          fontFamily: 'Poppins',
          fontWeight: 700,
          margin: 0
        }}>Chi Tiết Lương</h1>
        <div>
          <button style={{
            ...tabStyle,
            background: '#4A96FF',
            marginRight: '12px'
          }}>Hàng Tháng</button>
          <button style={{
            ...tabStyle,
            background: '#30314A'
          }}>Cả Năm</button>
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: '24px',
        marginBottom: '32px',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
      }}>
        <div style={cardStyle}>
          <div style={{ color: '#8E8EA3', marginBottom: '8px' }}>Tổng Thu Nhập</div>
          <div style={{ fontSize: '32px', fontWeight: 700 }}>46.000.000 ₫</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: '#8E8EA3', marginBottom: '8px' }}>Tổng Khấu Trừ</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#FF5151' }}>6.900.000 ₫</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: '#8E8EA3', marginBottom: '8px' }}>Thực Lãnh</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#4A96FF' }}>39.100.000 ₫</div>
        </div>
      </div>

      <div>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #30314A',
          marginBottom: '16px'
        }}>
          <div style={{
            padding: '8px 16px',
            borderBottom: '1px solid #FFFFFF',
            color: '#FFFFFF'
          }}>Thu Nhập & Khấu Trừ</div>
          <div style={{
            padding: '8px 16px',
            color: '#FFFFFF'
          }}>Lịch Sử Lương</div>
        </div>

        <div style={rowItemStyle}>
          <span>Lương cơ bản</span>
          <span>42.000.000 ₫</span>
        </div>
        <div style={rowItemStyle}>
          <span>Thưởng hiệu suất</span>
          <span>4.000.000 ₫</span>
        </div>
        <div style={rowItemStyle}>
          <span>Bảo hiểm xã hội (8%)</span>
          <span style={{ color: '#FF5151' }}>3.680.000 ₫</span>
        </div>
        <div style={rowItemStyle}>
          <span>Bảo hiểm y tế (1.5%)</span>
          <span style={{ color: '#FF5151' }}>690.000 ₫</span>
        </div>
        <div style={rowItemStyle}>
          <span>Bảo hiểm thất nghiệp (1%)</span>
          <span style={{ color: '#FF5151' }}>460.000 ₫</span>
        </div>
        <div style={rowItemStyle}>
          <span>Thuế thu nhập cá nhân</span>
          <span style={{ color: '#FF5151' }}>2.070.000 ₫</span>
        </div>
      </div>
    </div>
  );
};

PayrollDetails.defaultProps = {
  style: {}
};

export default PayrollDetails;

