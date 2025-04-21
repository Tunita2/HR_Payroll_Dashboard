"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import "../../styles/AdminStyles/Notifications.css"

// Custom hook for fetching data
const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch data from ${url}`);
        const result = await res.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching data from ${url}:`, err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, isLoading, error };
};

// Notification generators
const NotificationGenerators = {
  anniversary: (employees, currentDate = new Date()) => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    return employees
      .filter((employee) => {
        const startDate = new Date(employee.startDate);
        const startMonth = startDate.getMonth();
        const startDay = startDate.getDate();

        if (startMonth === currentMonth && startDay >= currentDay && startDay <= currentDay + 30) {
          return true;
        }
        
        if (startMonth === 11 && currentMonth === 0 && startDay >= 1 && startDay <= 31) {
          return true;
        }

        return false;
      })
      .map((employee) => {
        const startDate = new Date(employee.startDate);
        const yearsOfService = currentYear - startDate.getFullYear();

        if (yearsOfService % 5 === 0 || yearsOfService === 1) {
          return {
            id: `anniversary-${employee.id}`,
            type: "anniversary",
            title: `Work Anniversary: ${employee.name}`,
            message: `${employee.name} is approaching their ${yearsOfService} year work anniversary on ${startDate.toLocaleDateString()}.`,
            date: currentDate.toISOString(),
            read: false,
            data: employee,
          };
        }
        return null;
      })
      .filter(Boolean);
  },

  discrepancy: (payrolls) => {
    return payrolls
      .filter((payroll) => {
        const discrepancy = Number(payroll.discrepancy) || 0;
        const previousAmount = Number(payroll.previousAmount) || 1;
        const discrepancyPercentage = (discrepancy / previousAmount) * 100;
        return discrepancyPercentage > 10;
      })
      .map((payroll) => {
        const discrepancy = Number(payroll.discrepancy) || 0;
        const previousAmount = Number(payroll.previousAmount) || 1;
        const amount = Number(payroll.amount) || 0;
        const discrepancyPercentage = (discrepancy / previousAmount) * 100;
        
        return {
          id: `discrepancy-${payroll.id}`,
          type: "discrepancy",
          title: `Payroll Discrepancy: ${payroll.employeeName}`,
          message: `There is a significant discrepancy of $${discrepancy.toFixed(2)} (${discrepancyPercentage.toFixed(2)}%) in ${payroll.employeeName}'s payroll for ${payroll.period}.`,
          date: new Date().toISOString(),
          read: false,
          data: {
            ...payroll,
            discrepancy,
            previousAmount,
            amount
          },
        };
      });
  },

  payroll: (payrolls) => {
    return payrolls.map((payroll) => {
      const amount = Number(payroll.amount) || 0;
      return {
        id: `payroll-${payroll.id}`,
        type: "payroll",
        title: `Monthly Payroll: ${payroll.employeeName}`,
        message: `Monthly payroll notification for ${payroll.employeeName} for the period ${payroll.period} has been processed. Amount: $${amount.toFixed(2)}.`,
        date: new Date().toISOString(),
        read: false,
        data: {
          ...payroll,
          amount,
          discrepancy: Number(payroll.discrepancy) || 0,
          previousAmount: Number(payroll.previousAmount) || 0
        },
      };
    });
  }
};

// Tab Navigation Component
const TabNavigation = ({ activeTab, setActiveTab }) => (
  <div className="notifications-tabs">
    {["all", "anniversary", "discrepancy", "payroll"].map(tab => (
      <button 
        key={tab}
        className={activeTab === tab ? "active" : ""}
        onClick={() => setActiveTab(tab)}
      >
        {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1) + "s"}
      </button>
    ))}
  </div>
);

// Notification Details Component
const NotificationDetails = ({ notification }) => {
  if (!notification) return null;

  const { type, data } = notification;

  switch (type) {
    case "anniversary":
      return (
        <div className="notification-detail-section">
          <h4>Employee Details</h4>
          <div className="notification-detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{data.name}</span>
          </div>
          <div className="notification-detail-item">
            <span className="detail-label">Start Date:</span>
            <span className="detail-value">
              {new Date(data.startDate).toLocaleDateString()}
            </span>
          </div>
          <div className="notification-detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{data.email}</span>
          </div>
        </div>
      );

    case "discrepancy":
    case "payroll":
      return (
        <div className="notification-detail-section">
          <h4>Payroll Details</h4>
          <div className="notification-detail-item">
            <span className="detail-label">Employee:</span>
            <span className="detail-value">{data.employeeName}</span>
          </div>
          <div className="notification-detail-item">
            <span className="detail-label">Period:</span>
            <span className="detail-value">{data.period}</span>
          </div>
          <div className="notification-detail-item">
            <span className="detail-label">Current Amount:</span>
            <span className="detail-value">${data.amount.toFixed(2)}</span>
          </div>
          <div className="notification-detail-item">
            <span className="detail-label">Previous Amount:</span>
            <span className="detail-value">${data.previousAmount.toFixed(2)}</span>
          </div>
          {type === "discrepancy" && (
            <div className="notification-detail-item">
              <span className="detail-label">Discrepancy:</span>
              <span className="detail-value discrepancy">
                ${data.discrepancy.toFixed(2)} ({((data.discrepancy / data.previousAmount) * 100).toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
};

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch employee and payroll data
  const { data: employees, isLoading: employeesLoading, error: employeesError } = useFetch(
    "http://localhost:3001/api/admin/notifications/employees"
  );
  const { data: payrolls, isLoading: payrollsLoading, error: payrollsError } = useFetch(
    "http://localhost:3001/api/admin/notifications/payrolls"
  );

  // Generate notifications when data is available
  useEffect(() => {
    if (employees.length > 0 && payrolls.length > 0) {
      const generatedNotifications = [
        ...NotificationGenerators.anniversary(employees),
        ...NotificationGenerators.discrepancy(payrolls),
        ...NotificationGenerators.payroll(payrolls),
      ];

      setNotifications(generatedNotifications);
    }
  }, [employees, payrolls]);

  const filteredNotifications = useMemo(() => {
    return activeTab === "all"
      ? notifications
      : notifications.filter((notification) => notification.type === activeTab);
  }, [activeTab, notifications]);

  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const sendEmail = useCallback(async (notification) => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/notifications/send-payroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: notification.data.email || 'builetuan3432@gmail.com',
          subject: `Payroll Notification for ${notification.data.period}`,
          html: `
            <h2>Payroll Notification</h2>
            <p>Dear ${notification.data.employeeName},</p>
            <p>Your payroll for the period ${notification.data.period} has been processed.</p>
            <p>Amount: $${notification.data.amount.toFixed(2)}</p>
            <p>Thank you,</p>
            <p>Payroll Department</p>
          `
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      alert(`Payroll email sent to: ${notification.data.employeeName}`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    }
  }, []);

  const handleNotificationClick = useCallback((notification) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
    setIsModalOpen(true);
  }, [markAsRead]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNotification(null);
  }, []);

  if (employeesLoading || payrollsLoading) {
    return <div className="loading">Loading notifications...</div>;
  }

  if (employeesError || payrollsError) {
    return <div className="error">Error loading notifications. Please try again later.</div>;
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="notifications-content">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">No notifications found</div>
        ) : (
          <ul className="notifications-list">
            {filteredNotifications.map((notification) => (
              <li
                key={notification.id}
                className={`notification-item ${notification.read ? "read" : "unread"}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-indicator" data-type={notification.type}></div>
                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <span className="notification-date">
                    {new Date(notification.date).toLocaleString()}
                  </span>
                </div>
                <div className="notification-actions">
                  <button
                    className="action-button mark-read"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                  >
                    {notification.read ? "Marked as Read" : "Mark as Read"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isModalOpen && selectedNotification && (
        <div className="notification-modal-overlay" onClick={closeModal}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notification-modal-header">
              <h3>{selectedNotification.title}</h3>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>
            <div className="notification-modal-content">
              <div className="notification-detail-item">
                <span className="detail-label">Type:</span>
                <span className="detail-value notification-type" data-type={selectedNotification.type}>
                  {selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)}
                </span>
              </div>
              <div className="notification-detail-item">
                <span className="detail-label">Message:</span>
                <span className="detail-value">{selectedNotification.message}</span>
              </div>
              <div className="notification-detail-item">
                <span className="detail-label">Date:</span>
                <span className="detail-value">
                  {new Date(selectedNotification.date).toLocaleString()}
                </span>
              </div>

              <NotificationDetails notification={selectedNotification} />
            </div>
            <div className="notification-modal-actions">
              {selectedNotification.type === "payroll" && (
                <button 
                  className="action-button"
                  onClick={() => sendEmail(selectedNotification)}
                >
                  Send Email
                </button>
              )}
              <button className="action-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;