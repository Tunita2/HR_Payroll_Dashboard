"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import "../../styles/AdminStyles/Notifications.css"

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [employees, setEmployees] = useState([])
  const [payrolls, setPayrolls] = useState([])

  // Fetch employee data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/admin/notifications/employees")
        if (!res.ok) throw new Error("Failed to fetch employees")
        const data = await res.json()
        setEmployees(data)
      } catch (err) {
        console.error("Error fetching employees:", err)
      }
    }
    
    fetchEmployees()
  }, [])

  // Fetch payroll data
  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/admin/notifications/payrolls")
        if (!res.ok) throw new Error("Failed to fetch payrolls")
        const data = await res.json()
        setPayrolls(data)
      } catch (err) {
        console.error("Error fetching payrolls:", err)
      }
    }
    
    fetchPayrolls()
  }, [])

  // Generate anniversary notifications
  const generateAnniversaryNotifications = useCallback(() => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const currentMonth = today.getMonth()
    const currentDay = today.getDate()

    return employees
      .filter((employee) => {
        const startDate = new Date(employee.startDate)
        const startMonth = startDate.getMonth()
        const startDay = startDate.getDate()

        // Check if the anniversary is within the next 30 days
        if (startMonth === currentMonth && startDay >= currentDay && startDay <= currentDay + 30) {
          return true
        }

        // Handle year wrap (December to January)
        if (startMonth === 11 && currentMonth === 0 && startDay >= 1 && startDay <= 31) {
          return true
        }

        return false
      })
      .map((employee) => {
        const startDate = new Date(employee.startDate)
        const yearsOfService = currentYear - startDate.getFullYear()

        // Only notify for 1, 5, 10, 15, etc. year anniversaries
        if (yearsOfService % 5 === 0 || yearsOfService === 1) {
          return {
            id: `anniversary-${employee.id}`,
            type: "anniversary",
            title: `Work Anniversary: ${employee.name}`,
            message: `${employee.name} is approaching their ${yearsOfService} year work anniversary on ${startDate.toLocaleDateString()}.`,
            date: new Date().toISOString(),
            read: false,
            data: employee,
          }
        }

        return null
      })
      .filter(Boolean)
  }, [employees])

  // Generate discrepancy notifications
  const generateDiscrepancyNotifications = useCallback(() => {
    return payrolls
      .filter((payroll) => {
        // Convert values to numbers and ensure they exist
        const discrepancy = Number(payroll.discrepancy) || 0
        const previousAmount = Number(payroll.previousAmount) || 1 // Avoid division by zero
        
        // Consider a discrepancy significant if it's more than 10%
        const discrepancyPercentage = previousAmount > 0 ? (discrepancy / previousAmount) * 100 : 0
        return discrepancyPercentage > 10
      })
      .map((payroll) => {
        const discrepancy = Number(payroll.discrepancy) || 0
        const previousAmount = Number(payroll.previousAmount) || 1
        const discrepancyPercentage = previousAmount > 0 ? (discrepancy / previousAmount) * 100 : 0
        
        return {
          id: `discrepancy-${payroll.id}`,
          type: "discrepancy",
          title: `Payroll Discrepancy: ${payroll.employeeName}`,
          message: `There is a significant discrepancy of $${discrepancy.toFixed(2)} (${discrepancyPercentage.toFixed(2)}%) in ${payroll.employeeName}'s payroll for ${payroll.period}.`,
          date: new Date().toISOString(),
          read: false,
          data: {
            ...payroll,
            discrepancy: discrepancy,
            previousAmount: previousAmount,
            amount: Number(payroll.amount) || 0
          },
        }
      })
  }, [payrolls])

  // Generate monthly payroll notifications
  const generatePayrollNotifications = useCallback(() => {
    return payrolls.map((payroll) => {
      const amount = Number(payroll.amount) || 0
      
      return {
        id: `payroll-${payroll.id}`,
        type: "payroll",
        title: `Monthly Payroll: ${payroll.employeeName}`,
        message: `Monthly payroll notification for ${payroll.employeeName} for the period ${payroll.period} has been processed. Amount: $${amount.toFixed(2)}.`,
        date: new Date().toISOString(),
        read: false,
        data: {
          ...payroll,
          amount: amount,
          discrepancy: Number(payroll.discrepancy) || 0,
          previousAmount: Number(payroll.previousAmount) || 0
        },
      }
    })
  }, [payrolls])

  // Generate notifications when employees and payrolls data is available
  useEffect(() => {
    if (employees.length > 0 && payrolls.length > 0) {
      const generatedNotifications = [
        ...generateAnniversaryNotifications(),
        ...generateDiscrepancyNotifications(),
        ...generatePayrollNotifications(),
      ]

      setNotifications(generatedNotifications)
      setIsLoading(false)
    }
  }, [employees, payrolls, generateAnniversaryNotifications, generateDiscrepancyNotifications, generatePayrollNotifications])

  // Filter notifications based on active tab
  const filteredNotifications = useMemo(() => {
    return activeTab === "all" 
      ? notifications 
      : notifications.filter((notification) => notification.type === activeTab)
  }, [activeTab, notifications])

  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }, [])

  // Send email action
  const sendEmail = useCallback(async (notification) => {
    try {
      console.log(`Sending payroll email to: ${notification.data.employeeName}`)
      
      // Here you would integrate with your backend to send the actual email
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
      
      if (response.ok) {
        alert(`Payroll email sent to: ${notification.data.employeeName}`);
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email. Please try again.');
    }
  }, [])

  // Handle notification click
  const handleNotificationClick = useCallback((notification) => {
    markAsRead(notification.id)
    setSelectedNotification(notification)
    setIsModalOpen(true)
  }, [markAsRead])

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedNotification(null)
  }, [])

  // Tab navigation component
  const TabNavigation = () => (
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
  )

  // Notification detail section for modal
  const NotificationDetails = () => {
    if (!selectedNotification) return null
    
    switch (selectedNotification.type) {
      case "anniversary":
        return (
          <div className="notification-detail-section">
            <h4>Employee Details</h4>
            <div className="notification-detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{selectedNotification.data.name}</span>
            </div>
            <div className="notification-detail-item">
              <span className="detail-label">Start Date:</span>
              <span className="detail-value">
                {new Date(selectedNotification.data.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="notification-detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{selectedNotification.data.email}</span>
            </div>
          </div>
        )
      case "discrepancy":
      case "payroll":
        const { data } = selectedNotification
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
            {selectedNotification.type === "discrepancy" && (
              <div className="notification-detail-item">
                <span className="detail-label">Discrepancy:</span>
                <span className="detail-value discrepancy">
                  ${data.discrepancy.toFixed(2)} ({((data.discrepancy / data.previousAmount) * 100).toFixed(2)}%)
                </span>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <TabNavigation />
      </div>

      <div className="notifications-content">
        {isLoading ? (
          <div className="loading">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
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
                  <span className="notification-date">{new Date(notification.date).toLocaleString()}</span>
                </div>
                <div className="notification-actions">
                  <button
                    className="action-button mark-read"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(notification.id)
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
                <span className="detail-value">{new Date(selectedNotification.date).toLocaleString()}</span>
              </div>

              <NotificationDetails />
            </div>
            <div className="notification-modal-actions">
              {selectedNotification.type === "payroll" && (
                <button className="action-button" onClick={() => sendEmail(selectedNotification)}>
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
  )
}

export default Notifications