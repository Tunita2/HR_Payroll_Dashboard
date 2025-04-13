"use client"

import { useState } from "react"
import { format } from "date-fns"
import { NotificationType } from "../../lib/types"
import { Calendar, AlertTriangle, TrendingDown, Mail, Check, Eye } from "lucide-react"
import "../../styles/AdminStyles/NotificationCard.css"

function NotificationCard({ notification, onMarkAsRead }) {
  const [isHovered, setIsHovered] = useState(false)

  const getIcon = () => {
    switch (notification.type) {
      case NotificationType.ANNIVERSARY:
        return <Calendar className="icon anniversary" />
      case NotificationType.LEAVE_EXCEED:
        return <AlertTriangle className="icon leave" />
      case NotificationType.PAYROLL_DISCREPANCY:
        return <TrendingDown className="icon discrepancy" />
      case NotificationType.PAYROLL_SENT:
        return <Mail className="icon payroll" />
      default:
        return <Mail className="icon" />
    }
  }

  const getTypeLabel = () => {
    switch (notification.type) {
      case NotificationType.ANNIVERSARY:
        return "Anniversary"
      case NotificationType.LEAVE_EXCEED:
        return "Leave Alert"
      case NotificationType.PAYROLL_DISCREPANCY:
        return "Payroll Alert"
      case NotificationType.PAYROLL_SENT:
        return "Payroll"
      default:
        return "Notification"
    }
  }

  const getBadgeClass = () => {
    switch (notification.type) {
      case NotificationType.ANNIVERSARY:
        return "badge badge-anniversary"
      case NotificationType.LEAVE_EXCEED:
        return "badge badge-leave"
      case NotificationType.PAYROLL_DISCREPANCY:
        return "badge badge-discrepancy"
      case NotificationType.PAYROLL_SENT:
        return "badge badge-payroll"
      default:
        return "badge"
    }
  }

  const getCardClass = () => {
    let className = "notification-item"

    if (!notification.status) {
      className += " unread"

      switch (notification.type) {
        case NotificationType.ANNIVERSARY:
          className += " unread-anniversary"
          break
        case NotificationType.LEAVE_EXCEED:
          className += " unread-leave"
          break
        case NotificationType.PAYROLL_DISCREPANCY:
          className += " unread-discrepancy"
          break
        case NotificationType.PAYROLL_SENT:
          className += " unread-payroll"
          break
        default:
          break
      }
    }

    return className
  }

  return (
    <div className={getCardClass()} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="notification-content">
        <div className="notification-icon">{getIcon()}</div>
        <div className="notification-details">
          <div className="notification-header">
            <div className="notification-badges">
              <span className={getBadgeClass()}>{getTypeLabel()}</span>
              {!notification.status && <span className="badge badge-new">New</span>}
            </div>
            <span className="notification-time">{format(new Date(notification.date), "h:mm a")}</span>
          </div>
          <p className="notification-message">{notification.message}</p>
          <div className="notification-footer">
            <span className="notification-date">{format(new Date(notification.date), "MMM d, yyyy")}</span>
            {(isHovered || !notification.status) && (
              <button className="btn btn-small" onClick={() => onMarkAsRead(notification.id, !notification.status)}>
                {notification.status ? (
                  <span className="btn-text">
                    <Eye className="btn-icon" /> Mark as unread
                  </span>
                ) : (
                  <span className="btn-text">
                    <Check className="btn-icon" /> Mark as read
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationCard
