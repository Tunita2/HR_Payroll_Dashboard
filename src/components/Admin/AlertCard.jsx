"use client"
import "../../styles/AdminStyles/AlertCard.css"

function AlertCard({ alert, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getAlertTypeClass = (type) => {
    switch (type.toLowerCase()) {
      case "work-anniversary":
        return "alert-type-anniversary"
      case "leave-warning":
        return "alert-type-warning"
      default:
        return "alert-type-default"
    }
  }

  return (
    <div className={`alert-card ${getAlertTypeClass(alert.type)}`}>
      <div className="alert-header">
        <span className="alert-type">{alert.type}</span>
        <span className="alert-source">{alert.source}</span>
      </div>

      <div className="alert-content">
        <h3 className="employee-name">{alert.employeeName}</h3>
        <p className="alert-message">{alert.message}</p>
        <div className="alert-date">
          <span>Created: {formatDate(alert.createdAt)}</span>
        </div>
      </div>

      <div className="alert-actions">
        <button className="edit-button" onClick={onEdit}>
          Edit
        </button>
        <button className="delete-button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default AlertCard
