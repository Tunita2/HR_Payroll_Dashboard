"use client"

import { useState, useEffect } from "react"
import "../../styles/AdminStyles/AlertForm.css"

function AlertForm({ alert, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    type: "",
    employeeId: "",
    employeeName: "",
    message: "",
    source: "HUMAN_2025",
  })

  useEffect(() => {
    if (alert) {
      setFormData({
        type: alert.type || "",
        employeeId: alert.employeeId || "",
        employeeName: alert.employeeName || "",
        message: alert.message || "",
        source: alert.source || "HUMAN_2025",
      })
    }
  }, [alert])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="alert-form-container">
      <form className="alert-form" onSubmit={handleSubmit}>
        <h2>{alert ? "Edit Alert" : "Add New Alert"}</h2>

        <div className="form-group">
          <label htmlFor="type">Alert Type</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="work-anniversary">Work Anniversary</option>
            <option value="leave-warning">Leave Warning</option>
            <option value="payroll-issue">Payroll Issue</option>
            <option value="performance-review">Performance Review</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="employeeId">Employee ID</label>
          <input
            type="number"
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="employeeName">Employee Name</label>
          <input
            type="text"
            id="employeeName"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="source">Source</label>
          <select id="source" name="source" value={formData.source} onChange={handleChange} required>
            <option value="HUMAN_2025">HUMAN_2025</option>
            <option value="PAYROLL">PAYROLL</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            {alert ? "Update Alert" : "Create Alert"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AlertForm
