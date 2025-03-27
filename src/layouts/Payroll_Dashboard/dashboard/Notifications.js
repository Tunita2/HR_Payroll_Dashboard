import React from "react";
import "./Notifications.css";

const Notifications = ({ style }) => {
  const notifications = [
    "Ken accepts your invitation",
    "Report from LT Company",
    "4 Private Mails",
    "3 Comments to your Post",
    "New Version of RNS app",
    "15 Notifications from Social Apps",
  ];

  return (
    <div className="notifications" style={style}>
      <div className="notifications-header">
        <h2>Notifications</h2>
        <div className="notification-count">6</div>
      </div>
      <ul className="notification-list">
        {notifications.map((notification, index) => (
          <li key={index} className="notification-item">
            {notification}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
