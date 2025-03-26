import React, { useState } from 'react';

const UpcomingEvents_YearSelector_Statistics = ({ year = '2025', events = [] }) => {
  const [selectedYear, setSelectedYear] = useState(year);

  const upcomingEvents = events.length > 0 ? events : [
    {
      name: 'Nguyễn Văn A',
      role: 'Senior Developer',
      date: '15/03/2024',
      years: '5 năm'
    },
    {
      name: 'Trần Thị B',
      role: 'Frontend Developer', 
      date: '22/04/2024',
      years: '3 năm'
    },
    {
      name: 'Lê Văn C',
      role: 'Backend Developer',
      date: '07/05/2024', 
      years: '4 năm'
    },
    {
      name: 'Phạm Thị D',
      role: 'QA Engineer',
      date: '12/06/2024',
      years: '2 năm'
    }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '20px',
      flex: 1,
      minWidth: '1154px',
      flexWrap: 'wrap'
    }}>
      {/* Upcoming Events Section */}
      <div style={{
        flex: 1,
        background: '#121843',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minWidth: '280px'
      }}>
        <h1 style={{
          color: '#FFFFFF',
          fontFamily: 'Poppins',
          fontSize: '24px',
          fontWeight: 700,
          margin: 0
        }}>Thông Tin Kỷ Niệm</h1>

        <h2 style={{
          color: '#FFFFFF',
          fontFamily: 'Poppins',
          fontSize: '20px',
          fontWeight: 600,
          margin: 0
        }}>Sắp Tới</h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {upcomingEvents.map((event, index) => (
            <div key={index} style={{
              background: '#1D2053',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  color: '#FFFFFF',
                  fontFamily: 'Poppins',
                  fontSize: '16px',
                  fontWeight: 500,
                  marginBottom: '4px'
                }}>{event.name}</div>
                <div style={{
                  color: '#4A96FF',
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  fontWeight: 400
                }}>{event.role}</div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{
                  color: '#E0E0E0',
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  fontWeight: 400,
                  marginBottom: '4px'
                }}>{event.date}</div>
                <div style={{
                  color: '#4A96FF',
                  fontFamily: 'Poppins',
                  fontSize: '16px',
                  fontWeight: 700
                }}>{event.years}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Section */}
      <div style={{
        flex: 1,
        background: '#121843',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minWidth: '280px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#4A96FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img src="https://dashboard.codeparrot.ai/api/image/Z-NpRwzgNnZiU9gS/frame-5.png" alt="statistics" width="24" height="24" />
            </div>
            <span style={{
              color: '#FFFFFF',
              fontFamily: 'Poppins',
              fontSize: '20px',
              fontWeight: 600
            }}>Thống Kê</span>
          </div>

          <div style={{
            background: '#D9D9D9',
            borderRadius: '8px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}>
            <span style={{
              fontFamily: 'Poppins',
              fontSize: '16px',
              fontWeight: 400
            }}>{selectedYear}</span>
            <img src="https://dashboard.codeparrot.ai/api/image/Z-NpRwzgNnZiU9gS/vector.png" alt="dropdown" width="8" height="8" />
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px'
        }}>
          <div style={{
            flex: 1,
            background: '#1D2053',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{
              color: '#E0E0E0',
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 400,
              marginBottom: '8px'
            }}>Tổng Số Kỷ Niệm</div>
            <div style={{
              color: '#FFFFFF',
              fontFamily: 'Poppins',
              fontSize: '24px',
              fontWeight: 700
            }}>4</div>
          </div>

          <div style={{
            flex: 1,
            background: '#1D2053',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{
              color: '#E0E0E0',
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 400,
              marginBottom: '8px'
            }}>Năm Hiện Tại</div>
            <div style={{
              color: '#FFFFFF',
              fontFamily: 'Poppins',
              fontSize: '24px',
              fontWeight: 700
            }}>4</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents_YearSelector_Statistics;

