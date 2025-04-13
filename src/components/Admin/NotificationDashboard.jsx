"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, PlusCircle, X } from "lucide-react"
import NotificationCard from "./NotificationCard"
import { mockNotifications } from "../../lib/mock-data"
import { NotificationType } from "../../lib/types"
import "../../styles/AdminStyles/NotificationDashboard.css"
import "../../styles/AdminStyles/CreateAlertForm.css"

function NotificationDashboard() {
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState(undefined)
  const [showCalendar, setShowCalendar] = useState(false)
  const [activeTab, setActiveTab] = useState("byDate")

  // Create Alert Form state
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [alertType, setAlertType] = useState(NotificationType.ANNIVERSARY)
  const [employeeName, setEmployeeName] = useState("")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  // Initialize notifications from mock data
  useEffect(() => {
    // Check if we have saved read status in localStorage
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    } else {
      setNotifications(mockNotifications)
    }
  }, [])

  // Apply filters whenever filter state or notifications change
  useEffect(() => {
    let filtered = [...notifications]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (notification) =>
          notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.employeeName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((notification) => notification.type === typeFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((notification) => notification.status === (statusFilter === "read" ? true : false))
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = format(dateFilter, "yyyy-MM-dd")
      filtered = filtered.filter((notification) => {
        const notificationDate = format(new Date(notification.date), "yyyy-MM-dd")
        return notificationDate === filterDate
      })
    }

    setFilteredNotifications(filtered)
  }, [notifications, searchQuery, typeFilter, statusFilter, dateFilter])

  // Group notifications by date
  const groupByDate = (notifications) => {
    const groups = {}

    notifications.forEach((notification) => {
      const date = format(new Date(notification.date), "MMMM d, yyyy")
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(notification)
    })

    return groups
  }

  // Group notifications by type
  const groupByType = (notifications) => {
    const groups = {}

    notifications.forEach((notification) => {
      if (!groups[notification.type]) {
        groups[notification.type] = []
      }
      groups[notification.type].push(notification)
    })

    return groups
  }

  const handleMarkAsRead = (id, isRead) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, status: isRead } : notification,
    )

    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      status: true,
    }))

    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setTypeFilter("all")
    setStatusFilter("all")
    setDateFilter(undefined)
  }

  const handleDateSelect = (date) => {
    setDateFilter(date)
    setShowCalendar(false)
  }

  // Generate dynamic fields based on alert type
  const renderDynamicFields = () => {
    switch (alertType) {
      case NotificationType.ANNIVERSARY:
        return (
          <div className="form-group">
            <label htmlFor="years">Years of Service</label>
            <input
              type="number"
              id="years"
              min="1"
              max="50"
              value={details.years || ""}
              onChange={(e) => setDetails({ ...details, years: Number.parseInt(e.target.value) })}
              required
            />
          </div>
        )
      case NotificationType.LEAVE_EXCEED:
        return (
          <div className="form-group">
            <label htmlFor="daysExceeded">Days Exceeded</label>
            <input
              type="number"
              id="daysExceeded"
              min="1"
              max="30"
              value={details.daysExceeded || ""}
              onChange={(e) => setDetails({ ...details, daysExceeded: Number.parseInt(e.target.value) })}
              required
            />
          </div>
        )
      case NotificationType.PAYROLL_DISCREPANCY:
        return (
          <>
            <div className="form-group">
              <label htmlFor="previousAmount">Previous Amount</label>
              <input
                type="number"
                id="previousAmount"
                min="0"
                step="0.01"
                value={details.previousAmount || ""}
                onChange={(e) => setDetails({ ...details, previousAmount: Number.parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="currentAmount">Current Amount</label>
              <input
                type="number"
                id="currentAmount"
                min="0"
                step="0.01"
                value={details.currentAmount || ""}
                onChange={(e) => setDetails({ ...details, currentAmount: Number.parseFloat(e.target.value) })}
                required
              />
            </div>
          </>
        )
      case NotificationType.PAYROLL_SENT:
        return (
          <div className="form-group">
            <label htmlFor="month">Month</label>
            <select
              id="month"
              value={details.month || ""}
              onChange={(e) => setDetails({ ...details, month: e.target.value })}
              required
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
        )
      default:
        return null
    }
  }

  // Generate default message based on alert type and details
  const generateDefaultMessage = () => {
    switch (alertType) {
      case NotificationType.ANNIVERSARY:
        if (employeeName && details.years) {
          return `🎉 ${employeeName} is reaching their ${details.years} year work anniversary on ${new Date().toLocaleDateString()}.`
        }
        break
      case NotificationType.LEAVE_EXCEED:
        if (employeeName && details.daysExceeded) {
          return `⚠️ ${employeeName} has exceeded the allowed leave days by ${details.daysExceeded} days.`
        }
        break
      case NotificationType.PAYROLL_DISCREPANCY:
        if (employeeName && details.currentAmount && details.previousAmount) {
          return `📉 Major payroll change detected for ${employeeName}: ${details.currentAmount} vs ${details.previousAmount}.`
        }
        break
      case NotificationType.PAYROLL_SENT:
        if (employeeName && details.month) {
          return `📩 Payroll for ${details.month} ${new Date().getFullYear()} has been sent to ${employeeName}.`
        }
        break
      default:
        return ""
    }
    return ""
  }

  const handleCreateAlert = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError("")
    setFormSuccess("")

    // Create the alert object
    const newAlert = {
      id: `alert-${Date.now()}`,
      type: alertType,
      message: message || generateDefaultMessage(),
      date: new Date().toISOString(),
      status: false, // unread
      employeeName,
      details,
    }

    try {
      // In a real application, you would send this to your API
      // const response = await fetch('/api/alerts', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newAlert),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to create alert');
      // }

      // For demo purposes, we'll just add it to our local state
      const updatedNotifications = [newAlert, ...notifications]
      setNotifications(updatedNotifications)
      localStorage.setItem("notifications", JSON.stringify(updatedNotifications))

      // Reset the form
      setAlertType(NotificationType.ANNIVERSARY)
      setEmployeeName("")
      setMessage("")
      setDetails({})
      setFormSuccess("Alert created successfully!")

      // Optionally close the form after successful submission
      // setTimeout(() => setShowCreateForm(false), 2000)
    } catch (err) {
      setFormError(err.message || "Failed to create alert")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetCreateForm = () => {
    setAlertType(NotificationType.ANNIVERSARY)
    setEmployeeName("")
    setMessage("")
    setDetails({})
    setFormError("")
    setFormSuccess("")
  }

  const toggleCreateForm = () => {
    if (showCreateForm) {
      resetCreateForm()
    }
    setShowCreateForm(!showCreateForm)
  }

  const dateGrouped = groupByDate(filteredNotifications)
  const typeGrouped = groupByType(filteredNotifications)

  const unreadCount = notifications.filter((notification) => !notification.status).length

  const renderCalendar = () => {
    if (!showCalendar) return null

    // Simple calendar implementation
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      days.push(
        <div
          key={`day-${i}`}
          className={`calendar-day ${dateFilter && format(dateFilter, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") ? "selected" : ""}`}
          onClick={() => handleDateSelect(date)}
        >
          {i}
        </div>,
      )
    }

    return (
      <div className="calendar-popup">
        <div className="calendar-header">
          <h3>{format(currentDate, "MMMM yyyy")}</h3>
        </div>
        <div className="calendar-weekdays">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
        <div className="calendar-days">{days}</div>
      </div>
    )
  }

  return (
    <div className="notification-dashboard">
      <div className="notification-card">
        <div className="card-header">
          <div className="header-content">
            <h2 className="card-title">
              Notifications {unreadCount > 0 && <span className="unread-badge">{unreadCount} unread</span>}
            </h2>
            <div className="header-actions">
              <button className="btn btn-outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                Mark all as read
              </button>
              <button className="create-alert-toggle" onClick={toggleCreateForm}>
                {showCreateForm ? (
                  <>
                    <X size={16} /> Hide Form
                  </>
                ) : (
                  <>
                    <PlusCircle size={16} /> Create Alert
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {showCreateForm && (
          <div className="create-alert-section">
            <h3 className="form-title">Create New Alert</h3>

            {formError && <div className="alert-error">{formError}</div>}
            {formSuccess && <div className="alert-success">{formSuccess}</div>}

            <form onSubmit={handleCreateAlert} className="create-alert-form">
              <div className="form-group">
                <label htmlFor="alertType">Alert Type</label>
                <select
                  id="alertType"
                  value={alertType}
                  onChange={(e) => {
                    setAlertType(e.target.value)
                    setDetails({}) // Reset details when type changes
                    setMessage("") // Reset message when type changes
                  }}
                  required
                >
                  <option value={NotificationType.ANNIVERSARY}>Work Anniversary</option>
                  <option value={NotificationType.LEAVE_EXCEED}>Leave Exceed</option>
                  <option value={NotificationType.PAYROLL_DISCREPANCY}>Payroll Discrepancy</option>
                  <option value={NotificationType.PAYROLL_SENT}>Payroll Sent</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="employeeName">Employee Name</label>
                <input
                  type="text"
                  id="employeeName"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  required
                />
              </div>

              {renderDynamicFields()}

              <div className="form-group">
                <label htmlFor="message">
                  Message
                  <button
                    type="button"
                    className="generate-btn"
                    onClick={() => setMessage(generateDefaultMessage())}
                    disabled={!employeeName || Object.keys(details).length === 0}
                  >
                    Generate
                  </button>
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Alert"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card-content">
          <div className="filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search notifications..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-select">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">All types</option>
                <option value={NotificationType.ANNIVERSARY}>Work Anniversary</option>
                <option value={NotificationType.LEAVE_EXCEED}>Leave Exceed</option>
                <option value={NotificationType.PAYROLL_DISCREPANCY}>Payroll Discrepancy</option>
                <option value={NotificationType.PAYROLL_SENT}>Payroll Sent</option>
              </select>
            </div>

            <div className="filter-select">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All status</option>
                <option value="read">Read</option>
                <option value="unread">Unread</option>
              </select>
            </div>

            <div className="date-picker">
              <button className="btn btn-outline date-btn" onClick={() => setShowCalendar(!showCalendar)}>
                <CalendarIcon className="calendar-icon" />
                {dateFilter ? format(dateFilter, "PPP") : <span>Filter by date</span>}
              </button>
              {renderCalendar()}
            </div>

            <button className="btn btn-ghost" onClick={handleClearFilters}>
              Clear filters
            </button>
          </div>

          <div className="tabs">
            <div className="tabs-list">
              <button
                className={`tab ${activeTab === "byDate" ? "active" : ""}`}
                onClick={() => setActiveTab("byDate")}
              >
                Group by Date
              </button>
              <button
                className={`tab ${activeTab === "byType" ? "active" : ""}`}
                onClick={() => setActiveTab("byType")}
              >
                Group by Type
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "byDate" && (
                <div className="tab-panel">
                  {Object.keys(dateGrouped).length > 0 ? (
                    Object.entries(dateGrouped)
                      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                      .map(([date, notifications]) => (
                        <div key={date} className="notification-group">
                          <h3 className="group-title">{date}</h3>
                          <div className="notification-list">
                            {notifications.map((notification) => (
                              <NotificationCard
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={handleMarkAsRead}
                              />
                            ))}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="empty-message">No notifications match your filters</div>
                  )}
                </div>
              )}

              {activeTab === "byType" && (
                <div className="tab-panel">
                  {Object.keys(typeGrouped).length > 0 ? (
                    Object.entries(typeGrouped).map(([type, notifications]) => (
                      <div key={type} className="notification-group">
                        <h3 className="group-title">
                          {type === NotificationType.ANNIVERSARY && "Work Anniversary"}
                          {type === NotificationType.LEAVE_EXCEED && "Leave Exceed"}
                          {type === NotificationType.PAYROLL_DISCREPANCY && "Payroll Discrepancy"}
                          {type === NotificationType.PAYROLL_SENT && "Payroll Sent"}
                        </h3>
                        <div className="notification-list">
                          {notifications.map((notification) => (
                            <NotificationCard
                              key={notification.id}
                              notification={notification}
                              onMarkAsRead={handleMarkAsRead}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-message">No notifications match your filters</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationDashboard
