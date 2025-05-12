import React, { useState, useEffect } from "react";
import "../../styles/AdminStyles/Alerts.css"
import axiosInstance from './axiosInstance';

// Sample data
// const sampleData = [
//   {
//     id: 1,
//     employeeName: "John Smith",
//     employeeId: "EMP001",
//     department: "Accounting",
//     allowedDays: 12,
//     usedDays: 15,
//     daysExceeded: 3,
//     date: "04/15/2025",
//   },
//   {
//     id: 2,
//     employeeName: "Sarah Johnson",
//     employeeId: "EMP002",
//     department: "Human Resources",
//     allowedDays: 12,
//     usedDays: 18,
//     daysExceeded: 6,
//     date: "04/16/2025",
//   },
//   {
//     id: 3,
//     employeeName: "Michael Lee",
//     employeeId: "EMP003",
//     department: "IT",
//     allowedDays: 15,
//     usedDays: 16,
//     daysExceeded: 1,
//     date: "04/14/2025",
//   },
//   {
//     id: 4,
//     employeeName: "Emily Davis",
//     employeeId: "EMP004",
//     department: "Marketing",
//     allowedDays: 12,
//     usedDays: 17,
//     daysExceeded: 5,
//     date: "04/17/2025",
//   },
//   {
//     id: 5,
//     employeeName: "Robert Wilson",
//     employeeId: "EMP005",
//     department: "Sales",
//     allowedDays: 12,
//     usedDays: 16,
//     daysExceeded: 4,
//     date: "04/16/2025",
//   },
// ]

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "daysExceeded", direction: "desc" });
  const [filter, setFilter] = useState("");


  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axiosInstance.get("/admin/alerts")
        setAlerts(response.data)
      } catch (err) {
        console.error("Error fetching alerts:", err)
      }
    }

    fetchAlerts()
  }, [])


  // Sort alerts
  const sortedAlerts = React.useMemo(() => {
    const sortableAlerts = [...alerts]
    if (sortConfig.key) {
      sortableAlerts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableAlerts
  }, [alerts, sortConfig])

  // Filter alerts
  const filteredAlerts = React.useMemo(() => {
    if (!filter) return sortedAlerts
    return sortedAlerts.filter(
      (alert) =>
        (alert.employeeName && alert.employeeName.toLowerCase().includes(filter.toLowerCase())) ||
        (alert.employeeId && alert.employeeId.toLowerCase().includes(filter.toLowerCase())) ||
        (alert.department && alert.department.toLowerCase().includes(filter.toLowerCase()))
    )
  }, [sortedAlerts, filter])

  // Request sort
  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Dismiss alert
  const dismissAlert = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  // Get severity class
  const getSeverityClass = (daysExceeded) => {
    if (daysExceeded >= 5) return "critical"
    if (daysExceeded >= 3) return "high"
    return "medium"
  }

  return (
    <div className="leave-alerts-container">
      <div className="leave-alerts-header">
        <h2>Leave Days Exceeded Alerts</h2>
        <div className="leave-alerts-controls">
          <input
            type="text"
            placeholder="Search employees..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="leave-alerts-search"
          />
          <div className="leave-alerts-sort">
            <span>Sort by: </span>
            <select onChange={(e) => requestSort(e.target.value)} value={sortConfig.key}>
              <option value="daysExceeded">Days exceeded</option>
              <option value="employeeName">Employee name</option>
              <option value="department">Department</option>
              <option value="date">Date</option>
            </select>
            <button
              onClick={() =>
                setSortConfig({ ...sortConfig, direction: sortConfig.direction === "asc" ? "desc" : "asc" })
              }
              className="leave-alerts-sort-direction"
            >
              {sortConfig.direction === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="leave-alerts-empty">No alerts found</div>
      ) : (
        <div className="leave-alerts-list">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={`leave-alert-item ${getSeverityClass(alert.daysExceeded)}`}>
              <div className="leave-alert-content">
                <div className="leave-alert-employee">
                  <h3>{alert.employeeName}</h3>
                  <span className="leave-alert-id">ID: {alert.employeeId}</span>
                  <span className="leave-alert-department">{alert.department}</span>
                </div>
                <div className="leave-alert-details">
                  <div className="leave-alert-days">
                    <span className="leave-alert-label">Allowed leave days:</span>
                    <span>{alert.allowedDays} days</span>
                  </div>
                  <div className="leave-alert-days">
                    <span className="leave-alert-label">Used:</span>
                    <span>{alert.usedDays} days</span>
                  </div>
                  <div className="leave-alert-days exceeded">
                    <span className="leave-alert-label">Exceeded:</span>
                    <span>{alert.daysExceeded} days</span>
                  </div>
                </div>
                <div className="leave-alert-date">
                  <span>Updated: {alert.date}</span>
                </div>
              </div>
              <button className="leave-alert-dismiss" onClick={() => dismissAlert(alert.id)} title="Mark as read">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="leave-alerts-summary">
        <div className="leave-alerts-count">
          Total: <strong>{filteredAlerts.length}</strong> alerts
        </div>
        <div className="leave-alerts-legend">
          <span className="legend-item critical">Critical (≥5 days)</span>
          <span className="legend-item high">High (3-4 days)</span>
          <span className="legend-item medium">Medium (1-2 days)</span>
        </div>
      </div>
    </div>
  )
}

export default Alerts
