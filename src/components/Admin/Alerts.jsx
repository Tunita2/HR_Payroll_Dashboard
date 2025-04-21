import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../../styles/AdminStyles/Alerts.css";

const API_URL = "http://localhost:3001/api/admin";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "daysExceeded", direction: "desc" });
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/alerts`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAlerts(data);
        setError(null);
        setErrorDetails("");
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError("Failed to load alerts");
        setErrorDetails(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const sortedAlerts = useMemo(() => {
    if (!sortConfig.key) return alerts;
    
    return [...alerts].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [alerts, sortConfig]);

  const filteredAlerts = useMemo(() => {
    if (!filter) return sortedAlerts;
    const searchTerm = filter.toLowerCase();
    
    return sortedAlerts.filter(alert => 
      alert.employeeName.toLowerCase().includes(searchTerm) ||
      alert.employeeId.toLowerCase().includes(searchTerm) ||
      alert.department.toLowerCase().includes(searchTerm)
    );
  }, [sortedAlerts, filter]);

  const requestSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc"
    }));
  }, []);

  const dismissAlert = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_URL}/alerts/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to dismiss alert');
      }
      
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    } catch (err) {
      console.error('Error dismissing alert:', err);
      setError("Failed to dismiss alert");
      setErrorDetails(err.message);
      // Show error toast/notification
      alert('Failed to dismiss alert. Please try again.');
    }
  }, []);

  const getSeverityClass = useCallback((daysExceeded) => {
    if (daysExceeded >= 5) return "critical";
    if (daysExceeded >= 3) return "high";
    return "medium";
  }, []);

  if (isLoading) {
    return (
      <div className="leave-alerts-container">
        <div className="leave-alerts-loading">
          <div className="spinner"></div>
          <p>Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leave-alerts-container">
        <div className="leave-alerts-error">
          <h3>{error}</h3>
          {errorDetails && <p className="error-details">{errorDetails}</p>}
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
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
            <select 
              onChange={(e) => requestSort(e.target.value)} 
              value={sortConfig.key}
            >
              <option value="daysExceeded">Days exceeded</option>
              <option value="employeeName">Employee name</option>
              <option value="department">Department</option>
              <option value="date">Date</option>
            </select>
            <button
              onClick={() => setSortConfig(prev => ({
                ...prev,
                direction: prev.direction === "asc" ? "desc" : "asc"
              }))}
              className="leave-alerts-sort-direction"
              aria-label="Toggle sort direction"
            >
              {sortConfig.direction === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="leave-alerts-empty">
          {filter ? "No alerts match your search" : "No alerts found"}
        </div>
      ) : (
        <div className="leave-alerts-list">
          {filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`leave-alert-item ${getSeverityClass(alert.daysExceeded)}`}
            >
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
              <button 
                className="leave-alert-dismiss" 
                onClick={() => dismissAlert(alert.id)}
                title="Dismiss alert"
                aria-label="Dismiss alert"
              >
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
  );
};

export default Alerts;
