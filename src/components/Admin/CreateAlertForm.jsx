"use client"

import { useState } from "react"
import { NotificationType } from "../lib/types"
import "../../styles/AdminStyles/CreateAlertForm.css"

function CreateAlertForm({ onAlertCreated }) {
  const [alertType, setAlertType] = useState(NotificationType.ANNIVERSARY)
  const [employeeName, setEmployeeName] = useState("")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

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

      // For demo purposes, we'll just simulate a successful API call
      console.log("Alert created:", newAlert)

      // Call the callback function to update the parent component
      if (onAlertCreated) {
        onAlertCreated(newAlert)
      }

      // Reset the form
      setAlertType(NotificationType.ANNIVERSARY)
      setEmployeeName("")
      setMessage("")
      setDetails({})
      setSuccess("Alert created successfully!")
    } catch (err) {
      setError(err.message || "Failed to create alert")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-alert-container">
      <h2 className="form-title">Create New Alert</h2>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="create-alert-form">
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
  )
}

export default CreateAlertForm
