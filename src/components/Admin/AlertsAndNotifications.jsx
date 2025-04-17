"use client"

import { useState, useEffect } from "react"
import AlertsPage from "./AlertsPage"
import AlertForm from "./AlertForm"
import "../../styles/AdminStyles/AlertsAndNotifications.css"

function AlertsAndNotifications() {
  const [alerts, setAlerts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentAlert, setCurrentAlert] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3001/api/admin/alerts")
      if (!response.ok) {
        throw new Error("Failed to fetch alerts")
      }
      const data = await response.json()
      setAlerts(data)
      setError(null)
    } catch (err) {
      setError("Error fetching alerts. Using mock data instead.")
      setAlerts([
        {
          alertId: 1,
          type: "work-anniversary",
          employeeId: 101,
          employeeName: "Nguyen Van A",
          message: "Congrats on your 5-year anniversary!",
          source: "HUMAN_2025",
          createdAt: "2025-04-17T10:00:00",
        },
        {
          alertId: 2,
          type: "leave-warning",
          employeeId: 102,
          employeeName: "Tran Thi B",
          message: "Exceeded allowed leave days this month.",
          source: "PAYROLL",
          createdAt: "2025-04-15T09:30:00",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAlert = () => {
    setCurrentAlert(null)
    setIsFormOpen(true)
  }

  const handleEditAlert = (alert) => {
    setCurrentAlert(alert)
    setIsFormOpen(true)
  }

  const handleDeleteAlert = async (alertId) => {
    if (window.confirm("Are you sure you want to delete this alert?")) {
      try {
        const response = await fetch(`http://localhost:3001/api/admin/delete-alerts/${alertId}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete alert")
        }

        setAlerts(alerts.filter((alert) => alert.alertId !== alertId))
      } catch (err) {
        setError("Error deleting alert. Please try again.")
        console.error(err)
      }
    }
  }

  const handleFormSubmit = async (formData) => {
    try {
      let response

      if (currentAlert) {
        // Update existing alert
        response = await fetch(`http://localhost:3001/api/admin/update-alerts/${currentAlert.alertId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      } else {
        // Create new alert
        response = await fetch("http://localhost:3001/api/admin/add-alerts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      }

      if (!response.ok) {
        throw new Error("Failed to save alert")
      }

      const savedAlert = await response.json()

      if (currentAlert) {
        setAlerts(alerts.map((alert) => (alert.alertId === currentAlert.alertId ? savedAlert : alert)))
      } else {
        setAlerts([...alerts, savedAlert])
      }

      setIsFormOpen(false)
      setCurrentAlert(null)
    } catch (err) {
      setError("Error saving alert. Please try again.")
      console.error(err)
    }
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setCurrentAlert(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Alerts Management</h1>
        <button className="add-button" onClick={handleAddAlert}>
          Add New Alert
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading alerts...</div>
      ) : (
        <AlertsPage alerts={alerts} onEdit={handleEditAlert} onDelete={handleDeleteAlert} />
      )}

      {isFormOpen && (
        <div className="modal-overlay">
          <AlertForm alert={currentAlert} onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
        </div>
      )}
    </div>
  )
}

export default AlertsAndNotifications
