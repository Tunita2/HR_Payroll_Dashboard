"use client"

import { useState, useEffect } from "react"
import "../../styles/AdminStyles/AlertNotifications.css"

// Mock data (no types in JS)
const mockNotifications = [
  {
    id: 1,
    message: "John Doe is approaching 5 year work anniversary on May 15",
    type: "anniversary",
    source: "HUMAN_2025",
    date: "2025-04-30",
  },
  {
    id: 2,
    message: "Sarah Smith is approaching 10 year work anniversary on June 2",
    type: "anniversary",
    source: "HUMAN_2025",
    date: "2025-05-02",
  },
  {
    id: 3,
    message: "Mike Johnson has exceeded allowed leave days by 3 days",
    type: "leave-alert",
    source: "PAYROLL",
    date: "2025-05-01",
  },
  {
    id: 4,
    message: "Discrepancy detected: Current payroll period exceeds previous by 15%",
    type: "payroll-discrepancy",
    source: "PAYROLL",
    date: "2025-05-03",
  },
  {
    id: 5,
    message: "Monthly payroll notifications sent to all employees",
    type: "payroll-notification",
    source: "PAYROLL",
    date: "2025-05-01",
  },
  {
    id: 6,
    message: "Emily Davis is approaching 1 year work anniversary on May 20",
    type: "anniversary",
    source: "HUMAN_2025",
    date: "2025-04-29",
  },
]

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    // In real use, fetch from API
    setNotifications(mockNotifications)
  }, [])

  const getIconClass = (type) => {
    switch (type) {
      case "anniversary":
        return "icon-cake"
      case "leave-alert":
        return "icon-warning"
      case "payroll-discrepancy":
        return "icon-alert"
      case "payroll-notification":
        return "icon-mail"
      default:
        return "icon-info"
    }
  }

  return (
    <div className="notification-system">
      <h2>Alerts & Notifications</h2>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">No notifications available</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className={`notification-item ${notification.type}`}>
              <div className={`notification-icon ${getIconClass(notification.type)}`}></div>
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <div className="notification-meta">
                  <span className="notification-source">{notification.source}</span>
                  <span className="notification-date">{notification.date}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
