import React from 'react';

const NotificationList = ({ style = {} }) => {
  const notifications = [
    {
      id: 1,
      status: 'success',
      title: 'Triển khai thành công',
      message: 'Ứng dụng của bạn đã được triển khai thành công lên môi trường production',
      time: '2 phút trước',
      statusColor: '#4caf50',
      showMarkAsRead: true
    },
    {
      id: 2,
      status: 'warning',
      title: 'Cảnh báo bảo mật',
      message: 'Phát hiện 3 lỗ hổng bảo mật nghiêm trọng trong mã nguồn',
      time: '1 giờ trước',
      statusColor: '#ffc107',
      showMarkAsRead: false
    },
    {
      id: 3,
      status: 'error',
      title: 'Lỗi CI/CD Pipeline',
      message: 'Build thất bại do lỗi trong quá trình kiểm thử tự động',
      time: '3 giờ trước',
      statusColor: '#ff5151',
      showMarkAsRead: true
    }
  ];

  const NotificationItem = ({ notification }) => {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        background: notification.id % 2 === 0 ? '#1e1f35' : '#121843',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        minWidth: '300px',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: notification.statusColor,
              marginRight: '16px'
            }} />
            <span style={{
              color: '#fff',
              fontFamily: 'Poppins',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '24px'
            }}>
              {notification.title}
            </span>
          </div>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            {notification.showMarkAsRead && (
              <button style={{
                background: 'transparent',
                border: 'none',
                color: '#4a96ff',
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '21px',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.8'}
              onMouseOut={(e) => e.target.style.opacity = '1'}>
                Đánh dấu đã đọc
              </button>
            )}
            <button style={{
              background: 'transparent',
              border: 'none',
              color: '#ff5151',
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '21px',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.opacity = '0.8'}
            onMouseOut={(e) => e.target.style.opacity = '1'}>
              Xóa
            </button>
          </div>
        </div>
        <span style={{
          color: '#e0e0e0',
          fontFamily: 'Poppins',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '21px',
          marginBottom: '4px'
        }}>
          {notification.message}
        </span>
        <span style={{
          color: '#9e9e9e',
          fontFamily: 'Poppins',
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: '18px'
        }}>
          {notification.time}
        </span>
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      ...style
    }}>
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationList;

