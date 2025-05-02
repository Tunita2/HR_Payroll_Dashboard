import React, { useState, useEffect } from 'react';
import '../../styles/EmployeeStyles/Notifications.css';
import axios from 'axios';

// Hàm chuẩn hóa dữ liệu notifications cho cả hai DB
function normalizeNotifications(apiData) {
    const notifications = apiData.notifications || apiData || [];
    return notifications.map((item, idx) => ({
        id: item.id || item.NotificationID || idx + 1,
        type: item.type || item.Type || 'general',
        title: item.title || item.Title || '',
        message: item.message || item.Message || '',
        timestamp: item.timestamp ? new Date(item.timestamp) : (item.Timestamp ? new Date(item.Timestamp) : new Date()),
        read: item.read !== undefined ? item.read : (item.Read !== undefined ? item.Read : false)
    }));
}

const API_URL = 'http://localhost:3001/api/notifications';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');
                const response = await axios.get(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setNotifications(normalizeNotifications(response.data));
            } catch (err) {
                setError('Failed to load notifications. Please try again later.');
            } finally {
                setLoading(false);
            }
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
        return date instanceof Date ? date.toLocaleDateString('vi-VN') : '';
    };

    const formatTime = (date) => {
        return date instanceof Date ? date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
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

    if (loading) {
        return (
            <div className="notifications-wrapper">
                <div className="notifications-container">
                    <div className="notifications-loading">
                        <div className="loading-spinner"></div>
                        <p>Đang tải thông báo...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="notifications-wrapper">
                <div className="notifications-container">
                    <div className="error-container">
                        <p className="error-message">{error}</p>
                        <button onClick={() => window.location.reload()} className="retry-button">
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                    {filteredNotifications.length === 0 ? (
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
                                    <div className="notification-icon">{getNotificationIcon(notification.type)}</div>
                                    <div className="notification-content">
                                        <div className="notification-title">{notification.title}</div>
                                        <div className="notification-message">{notification.message}</div>
                                        <div className="notification-meta">
                                            <span className="notification-time">{getTimeAgo(notification.timestamp)}</span>
                                            {!notification.read && (
                                                <button className="mark-read-btn" onClick={() => handleMarkAsRead(notification.id)}>
                                                    Đánh dấu đã đọc
                                                </button>
                                            )}
                                            <button className="delete-btn" onClick={() => handleDeleteNotification(notification.id)}>
                                                Xóa
                                            </button>
                                        </div>
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