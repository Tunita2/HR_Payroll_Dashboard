import AlertCard from "./AlertCard"
import "../../styles/AdminStyles/AlertsPage.css"

function AlertsPage({ alerts, onEdit, onDelete }) {
  if (!alerts || alerts.length === 0) {
    return <div className="no-alerts">No alerts found</div>
  }

  return (
    <div className="alerts-page">
      <div className="alerts-container">
        {alerts.map((alert) => (
          <AlertCard
            key={alert.alertId}
            alert={alert}
            onEdit={() => onEdit(alert)}
            onDelete={() => onDelete(alert.alertId)}
          />
        ))}
      </div>
    </div>
  )
}

export default AlertsPage
