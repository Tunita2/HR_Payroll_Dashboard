import React, { useState, useEffect } from 'react';
import '../../styles/EmployeeStyles/LeaveDays_WorkStatus.css';
import axios from 'axios';

// Hàm chuẩn hóa dữ liệu leave/attendance cho cả hai DB
function normalizeLeaveWorkData(apiData) {
    // Nghỉ phép
    const leaveData = apiData.leaveData || apiData.leave || apiData.LeaveData || {};
    // Chấm công
    const workStatus = apiData.workStatus || apiData.attendance || apiData.WorkStatus || {};
    // Lịch sử chấm công
    const attendanceHistory = apiData.attendanceHistory || apiData.history || apiData.AttendanceHistory || [];
    return {
        leaveData: {
            annual: leaveData.annual || leaveData.Annual || { total: 0, used: 0, pending: 0 },
            sick: leaveData.sick || leaveData.Sick || { total: 0, used: 0, pending: 0 },
            personal: leaveData.personal || leaveData.Personal || { total: 0, used: 0, pending: 0 },
            unpaid: leaveData.unpaid || leaveData.Unpaid || { total: 0, used: 0, pending: 0 }
        },
        workStatus: {
            currentMonth: workStatus.currentMonth || workStatus.CurrentMonth || {
                workDays: 0, presentDays: 0, lateDays: 0, absentDays: 0, attendanceRate: 0, onTimeRate: 0
            },
            currentWeek: workStatus.currentWeek || workStatus.CurrentWeek || {
                workHours: 0, completedHours: 0, progress: 0
            }
        },
        attendanceHistory: attendanceHistory.map(item => ({
            date: item.date || item.Date || '',
            checkIn: item.checkIn || item.CheckIn || '',
            checkOut: item.checkOut || item.CheckOut || '',
            status: item.status || item.Status || ''
        }))
    };
}

const API_URL = 'http://localhost:3001/api/leave-work-status';

const LeaveDays_WorkStatus = () => {
    const [activeTab, setActiveTab] = useState('leave');
    const [leaveData, setLeaveData] = useState(null);
    const [workStatus, setWorkStatus] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');
                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = normalizeLeaveWorkData(response.data);
                setLeaveData(data.leaveData);
                setWorkStatus(data.workStatus);
                setAttendanceHistory(data.attendanceHistory);
            } catch (err) {
                setError('Failed to load leave/work status data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    // Calculate remaining leave days
    const calculateRemaining = (type) => {
        if (!leaveData) return 0;
        return leaveData[type].total - leaveData[type].used - leaveData[type].pending;
    };

    // Format percentage for display
    const formatPercentage = (value) => {
        return value ? value.toFixed(1) : '0.0';
    };

    if (loading) {
        return (
            <div className="ldws-loading">
                <div className="ldws-loading-spinner"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ldws-loading">
                <div className="ldws-loading-spinner"></div>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="ldws-container">
            <div className="ldws-header">
                <div className="ldws-tabs">
                    <button
                        className={`ldws-tab-btn ${activeTab === 'leave' ? 'active' : ''}`}
                        onClick={() => handleTabChange('leave')}
                    >
                        <span className="tab-icon">📅</span>
                        <span className="tab-text">Ngày nghỉ phép</span>
                    </button>
                    <button
                        className={`ldws-tab-btn ${activeTab === 'work' ? 'active' : ''}`}
                        onClick={() => handleTabChange('work')}
                    >
                        <span className="tab-icon">⏱️</span>
                        <span className="tab-text">Trạng thái làm việc</span>
                    </button>
                </div>
            </div>

            <div className="ldws-content">
                {activeTab === 'leave' ? (
                    <div className="leave-days-content">
                        <div className="leave-summary-section">
                            <h2 className="section-title">Tổng quan ngày nghỉ phép</h2>
                            <div className="leave-summary-cards">
                                <div className="leave-card">
                                    <div className="leave-card-header annual">
                                        <span className="leave-icon">🏖️</span>
                                        <h3>Nghỉ phép năm</h3>
                                    </div>
                                    <div className="leave-card-body">
                                        <div className="leave-progress">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${(leaveData.annual.used / leaveData.annual.total) * 100}%`, backgroundColor: '#4CAF50' }}
                                                ></div>
                                            </div>
                                            <div className="progress-text">{leaveData.annual.used}/{leaveData.annual.total}</div>
                                        </div>
                                        <div className="leave-details">
                                            <div className="leave-detail-item">
                                                <span className="detail-label">Đã sử dụng:</span>
                                                <span className="detail-value">{leaveData.annual.used} ngày</span>
                                            </div>
                                            <div className="leave-detail-item">
                                                <span className="detail-label">Đang chờ duyệt:</span>
                                                <span className="detail-value">{leaveData.annual.pending} ngày</span>
                                            </div>
                                            <div className="leave-detail-item">
                                                <span className="detail-label">Còn lại:</span>
                                                <span className="detail-value">{calculateRemaining('annual')} ngày</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="leave-card">
                                    <div className="leave-card-header sick">
                                        <span className="leave-icon">🏥</span>
                                        <h3>Nghỉ ốm</h3>
                                    </div>
                                    <div className="leave-card-body">
                                        <div className="leave-progress">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${(leaveData.sick.used / leaveData.sick.total) * 100}%`, backgroundColor: '#F44336' }}
                                                ></div>
                                            </div>
                                            <div className="progress-text">{leaveData.sick.used}/{leaveData.sick.total}</div>
                                        </div>
                                        <div className="leave-details">
                                            <div className="leave-detail-item">
                                                <span className="detail-label">Đã sử dụng:</span>
                                                <span className="detail-value">{leaveData.sick.used} ngày</span>
                                            </div>
                                            <div className="leave-detail-item">
                                                <span className="detail-label">Đang chờ duyệt:</span>
                                                <span className="detail-value">{leaveData.sick.pending} ngày</span>
                                            </div>
                                            <div className="leave-detail-item">
                                                <span className="detail-label">Còn lại:</span>
                                                <span className="detail-value">{calculateRemaining('sick')} ngày</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="leave-card">
                                    <div className="leave-card-header personal">
                                        <span className="leave-icon">🧘</span>
                                        <h3>Nghỉ cá nhân</h3>
                                    </div>
                                    <div className="leave-card-body">
                                        <div className="leave-progress">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${(leaveData.personal.used / leaveData.personal.total) * 100}%`, backgroundColor: '#2196F3' }}
                                                ></div>
                                            </div>
                                            <div className="progress-text">{leaveData.personal.used}/{leaveData.personal.total}</div>
                                        </div>
                                        <div className="leave-details">
                                            <div className="leave-detail-item">
                                                <span className="detail-label">Đã sử dụng:</span>
                                                <span className="detail-value">{leaveData.personal.used} ngày</span>
                                            </div>
                                            <div className="leave-detail-item">
                                                <span className="detail-label">Đang chờ duyệt:</span>
                                                <span className="detail-value">{leaveData.personal.pending} ngày</span>
                                            </div>
                                            <div className="leave-detail-item">
                                                <span className="detail-label">Còn lại:</span>
                                                <span className="detail-value">{calculateRemaining('personal')} ngày</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="leave-card">
                                    <div className="leave-card-header unpaid">
                                        <span className="leave-icon">⏳</span>
                                        <h3>Nghỉ không lương</h3>
                                    </div>
                                    <div className="leave-card-body">
                                        <div className="leave-progress">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${(leaveData.unpaid.used / leaveData.unpaid.total) * 100}%`, backgroundColor: '#9C27B0' }}
                                                ></div>
                                            </div>
                                            <div className="progress-text">{leaveData.unpaid.used}/{leaveData.unpaid.total}</div>
                                        </div>
                                        <div className="leave-details">
                                            <div className="leave-detail-item">
                                                <span className="detail-label">Đã sử dụng:</span>
                                                <span className="detail-value">{leaveData.unpaid.used} ngày</span>
                                            </div>
                                            <div className="leave-detail-item">
                                                <span className="detail-label">Đang chờ duyệt:</span>
                                                <span className="detail-value">{leaveData.unpaid.pending} ngày</span>
                                            </div>
                                            <div className="leave-detail-item">
                                                <span className="detail-label">Còn lại:</span>
                                                <span className="detail-value">{calculateRemaining('unpaid')} ngày</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="leave-upcoming-section">
                            <h2 className="section-title">Lịch nghỉ phép sắp tới</h2>
                            <div className="upcoming-leave-list">
                                <div className="upcoming-leave-item annual">
                                    <div className="leave-date">
                                        <div className="date-range">10/06 - 15/06/2023</div>
                                        <div className="leave-badge">Nghỉ phép năm</div>
                                    </div>
                                    <div className="leave-status approved">Đã duyệt</div>
                                </div>

                                <div className="upcoming-leave-item sick">
                                    <div className="leave-date">
                                        <div className="date-range">20/06 - 21/06/2023</div>
                                        <div className="leave-badge">Nghỉ ốm</div>
                                    </div>
                                    <div className="leave-status approved">Đã duyệt</div>
                                </div>

                                <div className="upcoming-leave-item personal">
                                    <div className="leave-date">
                                        <div className="date-range">25/06 - 26/06/2023</div>
                                        <div className="leave-badge">Nghỉ cá nhân</div>
                                    </div>
                                    <div className="leave-status approved">Đã duyệt</div>
                                </div>

                                <div className="upcoming-leave-item annual-pending">
                                    <div className="leave-date">
                                        <div className="date-range">05/07 - 07/07/2023</div>
                                        <div className="leave-badge">Nghỉ phép năm</div>
                                    </div>
                                    <div className="leave-status pending">Đang chờ duyệt</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="work-status-content">
                        <div className="work-status-summary">
                            <div className="work-status-card attendance">
                                <h3 className="card-title">Tỷ lệ chuyên cần tháng này</h3>
                                <div className="status-progress">
                                    <div className="progress-percentage">
                                        {formatPercentage(workStatus.currentMonth.attendanceRate)}%
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${workStatus.currentMonth.attendanceRate}%`,
                                                backgroundColor: workStatus.currentMonth.attendanceRate >= 90 ? '#4CAF50' :
                                                    workStatus.currentMonth.attendanceRate >= 75 ? '#FF9800' : '#F44336'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="status-details">
                                    <div className="status-detail-item">
                                        <span className="detail-label">Ngày làm việc:</span>
                                        <span className="detail-value">{workStatus.currentMonth.workDays} ngày</span>
                                    </div>
                                    <div className="status-detail-item">
                                        <span className="detail-label">Có mặt:</span>
                                        <span className="detail-value">{workStatus.currentMonth.presentDays} ngày</span>
                                    </div>
                                    <div className="status-detail-item">
                                        <span className="detail-label">Đi muộn:</span>
                                        <span className="detail-value">{workStatus.currentMonth.lateDays} ngày</span>
                                    </div>
                                    <div className="status-detail-item">
                                        <span className="detail-label">Vắng mặt:</span>
                                        <span className="detail-value">{workStatus.currentMonth.absentDays} ngày</span>
                                    </div>
                                </div>
                            </div>

                            <div className="work-status-card punctuality">
                                <h3 className="card-title">Tỷ lệ đúng giờ</h3>
                                <div className="status-progress">
                                    <div className="progress-percentage">
                                        {formatPercentage(workStatus.currentMonth.onTimeRate)}%
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${workStatus.currentMonth.onTimeRate}%`,
                                                backgroundColor: workStatus.currentMonth.onTimeRate >= 90 ? '#4CAF50' :
                                                    workStatus.currentMonth.onTimeRate >= 75 ? '#FF9800' : '#F44336'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="status-details">
                                    <div className="status-detail-item">
                                        <span className="detail-label">Ngày có mặt:</span>
                                        <span className="detail-value">{workStatus.currentMonth.presentDays} ngày</span>
                                    </div>
                                    <div className="status-detail-item">
                                        <span className="detail-label">Đúng giờ:</span>
                                        <span className="detail-value">{workStatus.currentMonth.presentDays - workStatus.currentMonth.lateDays} ngày</span>
                                    </div>
                                    <div className="status-detail-item">
                                        <span className="detail-label">Đi muộn:</span>
                                        <span className="detail-value">{workStatus.currentMonth.lateDays} ngày</span>
                                    </div>
                                </div>
                            </div>

                            <div className="work-status-card weekly-progress">
                                <h3 className="card-title">Tiến độ tuần này</h3>
                                <div className="status-progress">
                                    <div className="progress-percentage">
                                        {formatPercentage(workStatus.currentWeek.progress)}%
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${workStatus.currentWeek.progress}%`,
                                                backgroundColor: workStatus.currentWeek.progress >= 90 ? '#4CAF50' :
                                                    workStatus.currentWeek.progress >= 75 ? '#FF9800' : '#F44336'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="status-details">
                                    <div className="status-detail-item">
                                        <span className="detail-label">Giờ làm việc yêu cầu:</span>
                                        <span className="detail-value">{workStatus.currentWeek.workHours} giờ</span>
                                    </div>
                                    <div className="status-detail-item">
                                        <span className="detail-label">Đã hoàn thành:</span>
                                        <span className="detail-value">{workStatus.currentWeek.completedHours} giờ</span>
                                    </div>
                                    <div className="status-detail-item">
                                        <span className="detail-label">Còn lại:</span>
                                        <span className="detail-value">{workStatus.currentWeek.workHours - workStatus.currentWeek.completedHours} giờ</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="attendance-history-section">
                            <h2 className="section-title">Lịch sử chấm công gần đây</h2>
                            <div className="attendance-table-container">
                                <table className="attendance-table">
                                    <thead>
                                        <tr>
                                            <th>Ngày</th>
                                            <th>Giờ vào</th>
                                            <th>Giờ ra</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceHistory.map((record, index) => (
                                            <tr key={index} className={record.status === 'Late' ? 'late-record' : ''}>
                                                <td>{record.date}</td>
                                                <td>{record.checkIn}</td>
                                                <td>{record.checkOut}</td>
                                                <td>
                                                    <span className={`status-badge ${record.status === 'Late' ? 'late' : 'on-time'}`}>
                                                        {record.status === 'Late' ? 'Đi muộn' : 'Đúng giờ'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveDays_WorkStatus;
