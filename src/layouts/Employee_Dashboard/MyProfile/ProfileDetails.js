import React from 'react';

const ProfileDetails = ({ style }) => {
  const defaultData = {
    name: "Nguyễn Văn An",
    role: "software engineer",
    personalInfo: {
      fullName: "Nguyễn Văn An",
      idNumber: "001301xxxxxx",
      email: "an.nguyen@company.com",
      phone: "0912 345 678",
      address: "Đà Nẵng, Việt Nam",
      education: "Đại học Duy Tân"
    },
    workInfo: {
      position: "Software Engineer",
      department: "Engineering",
      startDate: "2021-06-15",
      manager: "Sarah Chen",
      employmentType: "Full-time",
      salary: "45000",
      office: "Da Nang Office"
    }
  };

  return (
    <div style={{
      ...style,
      backgroundColor: '#121843',
      padding: '20px',
      color: '#fff',
      fontFamily: 'Poppins, sans-serif',
      borderRadius: '8px',
      maxWidth: '1146px',
      margin: '0 auto',
    }}>
      {/* Profile Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
      }}>
        <img 
          src="https://dashboard.codeparrot.ai/api/image/Z-NkRgzgNnZiU9gM/image.png"
          alt="Profile"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            marginRight: '30px',
          }}
        />
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            margin: '0 0 5px 0',
            color: '#fff',
          }}>{defaultData.name}</h1>
          <p style={{
            fontSize: '16px',
            color: '#4A96FF',
            margin: 0,
          }}>{defaultData.role}</p>
        </div>
      </div>

      {/* Personal Information */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '20px',
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#4A96FF',
            margin: '0 0 10px 0',
          }}>Thông tin cá nhân</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {Object.entries({
            'Họ và tên': defaultData.personalInfo.fullName,
            'Số CCCD': defaultData.personalInfo.idNumber,
            'Email': defaultData.personalInfo.email,
            'Số điện thoại': defaultData.personalInfo.phone,
            'Địa chỉ': defaultData.personalInfo.address,
            'Trình độ học vấn': defaultData.personalInfo.education,
          }).map(([label, value]) => (
            <div key={label}>
              <p style={{
                fontSize: '14px',
                color: '#4A96FF',
                margin: '0 0 5px 0',
              }}>{label}</p>
              <p style={{
                fontSize: '16px',
                margin: 0,
              }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Work Information */}
      <div>
        <div style={{
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '20px',
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#4A96FF',
            margin: '0 0 10px 0',
          }}>Thông tin Công Việc</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {Object.entries({
            'Vị trí': defaultData.workInfo.position,
            'Phòng ban': defaultData.workInfo.department,
            'Ngày bắt đầu': defaultData.workInfo.startDate,
            'Quản lý trực tiếp': defaultData.workInfo.manager,
            'Trạng thái': defaultData.workInfo.employmentType,
            'Lương cơ bản (USD)': defaultData.workInfo.salary,
            'Địa điểm làm việc': defaultData.workInfo.office,
          }).map(([label, value]) => (
            <div key={label}>
              <p style={{
                fontSize: '14px',
                color: '#4A96FF',
                margin: '0 0 5px 0',
              }}>{label}</p>
              <p style={{
                fontSize: '16px',
                margin: 0,
              }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <button
          style={{
            backgroundColor: '#4A96FF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
          onClick={() => {}}
        >
          <img 
            src="https://dashboard.codeparrot.ai/api/image/Z-NkRgzgNnZiU9gM/frame-5.png"
            alt="Edit"
            style={{
              width: '20px',
              height: '20px',
            }}
          />
          Chỉnh sửa
        </button>
      </div>
    </div>
  );
};

export default ProfileDetails;

