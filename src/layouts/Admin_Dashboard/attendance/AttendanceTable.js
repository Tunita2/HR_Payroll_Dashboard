import React, { useEffect, useState } from 'react';
import "./AttendanceTable.css";

const AttendanceTable = ({ data = [] }) => {
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "status-present";
      case "absence":
        return "status-absence";
      case "leave":
        return "status-leave";
      default:
        return "";
    }
  };

  return (
    <div className="attendance-table">
      <div className="table-header">
        <div className="header-cell">ID</div>
        <div className="header-cell">Họ và tên</div>
        <div className="header-cell">Phòng ban</div>
        <div className="header-cell">Ngày</div>
        <div className="header-cell">Trạng thái</div>
        <div className="header-cell">Ngày làm việc</div>
        <div className="header-cell">Vắng mặt</div>
        <div className="header-cell">Nghỉ phép</div>
        <div className="header-cell">Ghi chú</div>
      </div>

      <div className="table-body">
        {data.length > 0 ? (
          data.map((row, index) => (
            <div key={index} className="table-row">
              <div className="table-cell">{row.id}</div>
              <div className="table-cell">{row.fullName}</div>
              <div className="table-cell">{row.department}</div>
              <div className="table-cell">{new Date(row.date).toLocaleDateString('vi-VN')}</div>
              <div className="table-cell">
                <span className={`status-badge ${getStatusStyle(row.status)}`}>
                  {row.status}
                </span>
              </div>
              <div className="table-cell">{row.workings}</div>
              <div className="table-cell">{row.absences}</div>
              <div className="table-cell">{row.leaves}</div>
              <div className="table-cell">{row.comment}</div>
            </div>
          ))
        ) : (
          <div className="no-data">Không có dữ liệu để hiển thị</div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTable;