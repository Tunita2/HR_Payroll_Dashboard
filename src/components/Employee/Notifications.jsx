import React, { useState, useEffect } from 'react';
import '../../styles/EmployeeStyles/Notifications.css';

// Mock data for notifications
const mockNotifications = [
    {
        id: 1,
        type: 'payroll',
        title: 'Lương tháng 5 đã được chuyển',
        message: 'Lương của bạn đã được chuyển vào tài khoản ngân hàng.',
        timestamp: new Date(2023, 4, 25, 9, 30),
        read: false
    },
    {
        id: 2,
        type: 'leave',
        title: 'Đơn nghỉ phép đã được phê duyệt',
        message: 'Đơn xin nghỉ phép từ ngày 10/06 đến 15/06 đã được phê duyệt.',
        timestamp: new Date(2023, 5, 5, 14, 15),
        read: true
    },
    {
        id: 3,
        type: 'task',
        title: 'Nhiệm vụ mới được giao',
        message: 'Bạn có một nhiệm vụ mới: "Hoàn thành báo cáo quý 2".',
        timestamp: new Date(2023, 5, 10, 11, 0),
        read: false
    },
    {
        id: 4,
        type: 'payroll',
        title: 'Thông báo thưởng',
        message: 'Bạn đã nhận được khoản thưởng thành tích xuất sắc.',
        timestamp: new Date(2023, 5, 15, 16, 45),
        read: false
    },
    {
        id: 5,
        type: 'task',
        title: 'Nhắc nhở deadline',
        message: 'Deadline dự án Marketing sẽ kết thúc vào ngày mai.',
        timestamp: new Date(2023, 5, 18, 8, 0),
        read: true
    },
];

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call to fetch notifications
        const fetchNotifications = async () => {
            setLoading(true);
            // In a real app, this would be an API call
            setTimeout(() => {
                setNotifications(mockNotifications);
                setLoading(false);
            }, 800);
        };

        fetchNotifications();
    }, []);

    const handleTabChange = (newValue) => {
        setFilter(newValue);
    };

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        ));
    };

    const handleDeleteNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : filter === 'unread'
            ? notifications.filter(notification => !notification.read)
            : notifications.filter(notification => notification.type === filter);

    const unreadCount = notifications.filter(notification => !notification.read).length;

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'payroll':
                return '💰';
            case 'leave':
                return '📅';
            case 'task':
                return '📋';
            default:
                return '🔔';
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('vi-VN');
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} phút trước`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        } else {
            return formatDate(timestamp);
        }
    };

    return (
        <div className="notifications-wrapper">
            <div className="notifications-container">
                <div className="notifications-header">
                    <div className="notifications-title">
                        <div className="icon-container">
                            <span className="notifications-icon">🔔</span>
                            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                        </div>
                        <h1>Thông báo</h1>
                    </div>
                    <div className="notifications-actions">
                        <button
                            className="btn btn-primary"
                            onClick={handleMarkAllAsRead}
                            disabled={unreadCount === 0}
                        >
                            <span className="btn-icon">✓</span>
                            <span className="btn-text">Đánh dấu đã đọc</span>
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={handleClearAll}
                            disabled={notifications.length === 0}
                        >
                            <span className="btn-icon">🗑️</span>
                            <span className="btn-text">Xóa tất cả</span>
                        </button>
                    </div>
                </div>

                <div className="notifications-tabs">
                    <button
                        className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => handleTabChange('all')}
                    >
                        <span className="tab-icon">📋</span>
                        <span className="tab-text">Tất cả</span>
                    </button>
                    <button
                        className={`tab-btn ${filter === 'unread' ? 'active' : ''}`}
                        onClick={() => handleTabChange('unread')}
                    >
                        <span className="tab-icon">📬</span>
                        <span className="tab-text">Chưa đọc</span>
                        {unreadCount > 0 && <span className="badge-small">{unreadCount}</span>}
                    </button>
                    <button
                        className={`tab-btn ${filter === 'payroll' ? 'active' : ''}`}
                        onClick={() => handleTabChange('payroll')}
                    >
                        <span className="tab-icon">💰</span>
                        <span className="tab-text">Lương & Thưởng</span>
                    </button>
                    <button
                        className={`tab-btn ${filter === 'leave' ? 'active' : ''}`}
                        onClick={() => handleTabChange('leave')}
                    >
                        <span className="tab-icon">📅</span>
                        <span className="tab-text">Nghỉ phép</span>
                    </button>
                    <button
                        className={`tab-btn ${filter === 'task' ? 'active' : ''}`}
                        onClick={() => handleTabChange('task')}
                    >
                        <span className="tab-icon">📋</span>
                        <span className="tab-text">Nhiệm vụ</span>
                    </button>
                </div>

                <div className="notifications-content">
                    {loading ? (
                        <div className="notifications-loading">
                            <div className="loading-spinner"></div>
                            <p>Đang tải th��ng báo...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="notifications-empty">
                            <div className="empty-icon">📭</div>
                            <p>Không có thông báo nào</p>
                        </div>
                    ) : (
                        <div className="notifications-list">
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                >
                                    <div className="notification-icon">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    <div className="notification-content">
                                        <div className="notification-header">
                                            <h3 className="notification-title">{notification.title}</h3>
                                            {!notification.read && <span className="new-badge">Mới</span>}
                                        </div>
                                        <p className="notification-message">{notification.message}</p>
                                        <div className="notification-time">
                                            <span className="time-item"><span className="time-icon">📅</span> {formatDate(notification.timestamp)}</span>
                                            <span className="time-item"><span className="time-icon">⏰</span> {formatTime(notification.timestamp)}</span>
                                            <span className="time-ago">({getTimeAgo(notification.timestamp)})</span>
                                        </div>
                                    </div>
                                    <div className="notification-actions">
                                        {!notification.read && (
                                            <button
                                                className="action-btn read-btn"
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                title="Đánh dấu đã đọc"
                                            >
                                                ✓
                                            </button>
                                        )}
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDeleteNotification(notification.id)}
                                            title="Xóa"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;