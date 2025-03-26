import React from 'react';

const LeaveStatusSection_LeaveApplicationSection_QuickActions = () => {
  const leaveData = [
    {
      type: 'Nghỉ phép',
      startDate: '15/02/2024',
      endDate: '16/02/2024',
      days: '2 ngày',
      status: 'Đã duyệt'
    },
    {
      type: 'Nghỉ ốm', 
      startDate: '10/01/2024',
      endDate: '10/01/2024',
      days: '1 ngày',
      status: 'Đã duyệt'
    }
  ];

  const quickActions = ['Xem lịch', 'Lịch nhóm', 'Ngày lễ'];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      minWidth: '1000px',
      minHeight: '600px',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Top Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#fff'
        }}>Quản Lý Nghỉ Phép & Trạng Thái</h1>
        <div style={{display: 'flex', gap: '16px'}}>
          <button style={{
            background: '#4A96FF',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            color: '#fff',
            cursor: 'pointer'
          }}>
            Đổi trạng thái
          </button>
          <button style={{
            background: '#4A96FF',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}>
            <img src="https://dashboard.codeparrot.ai/api/image/Z-NnHwzgNnZiU9gP/image.png" alt="" style={{width: 24, height: 24}} />
            Tạo đơn xin nghỉ
          </button>
        </div>
      </div>

      <div style={{display: 'flex', gap: '24px', flexWrap: 'wrap'}}>
        {/* Left Column */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px', flex: '1 1 280px'}}>
          {/* Leave Days Section */}
          <div style={{
            background: '#121843',
            borderRadius: '8px',
            padding: '24px',
            boxSizing: 'border-box'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#fff',
              marginBottom: '24px'
            }}>Số Ngày Nghỉ Còn Lại</h2>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#fff'}}>Nghỉ phép năm</span>
                <span style={{color: '#4A96FF'}}>12 ngày</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#fff'}}>Nghỉ ốm</span>
                <span style={{color: '#4A96FF'}}>6 ngày</span>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span style={{color: '#fff'}}>Nghỉ không lương</span>
                <span style={{color: '#FF5151'}}>0 ngày</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div style={{
            background: '#121843',
            borderRadius: '8px',
            padding: '24px',
            boxSizing: 'border-box'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#fff',
              marginBottom: '24px'
            }}>Thao Tác Nhanh</h2>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  style={{
                    background: '#2A2C43',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '12px',
                    color: '#fff',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#3A3C53'}
                  onMouseOut={(e) => e.target.style.background = '#2A2C43'}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{flex: '2 1 600px'}}>
          <div style={{
            background: '#121843',
            borderRadius: '8px',
            padding: '24px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: '#4A96FF',
                  borderRadius: '50%'
                }}></div>
                <span style={{color: '#fff'}}>Tại văn phòng</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{
                display: 'flex',
                background: '#2A2C43',
                padding: '16px',
                borderRadius: '4px',
                color: '#fff',
                fontWeight: 600
              }}>
                <div style={{flex: 1}}>Loại nghỉ</div>
                <div style={{flex: 1}}>Ngày bắt đầu</div>
                <div style={{flex: 1}}>Ngày kết thúc</div>
                <div style={{flex: 1}}>Số ngày</div>
                <div style={{flex: 1}}>Trạng thái</div>
              </div>

              {leaveData.map((leave, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    background: '#2A2C43',
                    padding: '16px',
                    borderRadius: '4px',
                    color: '#fff'
                  }}
                >
                  <div style={{flex: 1}}>{leave.type}</div>
                  <div style={{flex: 1}}>{leave.startDate}</div>
                  <div style={{flex: 1}}>{leave.endDate}</div>
                  <div style={{flex: 1}}>{leave.days}</div>
                  <div style={{flex: 1, color: '#22C55E'}}>{leave.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveStatusSection_LeaveApplicationSection_QuickActions;

