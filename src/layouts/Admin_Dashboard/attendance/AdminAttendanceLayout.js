import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar_Payroll";
import AttendanceTable from "./AttendanceTable";
import "./AttendanceLayout.css";

const AdminEmployeeListLayout = () => {

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState('2024-01'); // Tháng hiện tại

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/attendance?month=${month}`);
        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu điểm danh');
        }
        const data = await response.json();
        setAttendanceData(data);
      } catch (error) {
        console.error('Lỗi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month]);

  return (
    <div className="layout-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="main-content">
          <Header />
        <div className="content-area">
          <div className="attendance-table-container">
            <div className="attendance-page">
              <div className="month-selector">
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="loading">Đang tải dữ liệu...</div>
              ) : (
                <AttendanceTable data={attendanceData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEmployeeListLayout;
