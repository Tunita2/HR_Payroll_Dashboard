import { useState } from "react";
import "../styles/ContentDashboard.css";
import { FaSearch, FaBell } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Sample data for the graph
const paymentHistoryData = {
  labels: ["Feb 1", "Feb 8", "Feb 15", "Feb 22", "Feb 28"],
  datasets: [
    {
      label: "Revenue",
      data: [3000, 2000, 4251, 4000, 4500],
      borderColor: "#00C4B4",
      backgroundColor: "rgba(0, 196, 180, 0.2)",
      fill: true,
      tension: 0.4,
    },
  ],
};

// Sample notifications data
const notifications = [
  { id: 1, message: "Ken accepted your invitation", icon: "👍" },
  { id: 2, message: "Report from LT Company", icon: "📄" },
  { id: 3, message: "4 Private Mails", icon: "✉️" },
  { id: 4, message: "3 Comments to your Post", icon: "💬" },
  { id: 5, message: "New Version of RNS app", icon: "🔔" },
  { id: 6, message: "15 Notifications from Social Apps", icon: "📱" },
];

// Sample calendar data (highlighted dates)
const highlightedDates = [2, 5, 11, 15, 22];

const ContentDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("1M");

  // Time range options for Payment History
  const timeRanges = ["1M", "3M", "6M", "1Y"];

  // Generate calendar days for March 2025
  const daysInMarch = 31;
  const calendarDays = Array.from({ length: daysInMarch }, (_, i) => i + 1);

  return (
    <div className="dashboard">
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Total Employee</h3>
          <p className="value">5672</p>
          <p className="change">+14% inc</p>
          <div className="progress-circle">+74%</div>
        </div>
        <div className="card">
          <h3>Total Salary Budget</h3>
          <p className="value">234</p>
          <p className="change">+14% inc</p>
          <div className="progress-circle">+74%</div>
        </div>
        <div className="card">
          <h3>Total Upcoming Anniversary</h3>
          <p className="value">3567</p>
          <p className="change">+14% inc</p>
          <div className="progress-circle">+74%</div>
        </div>
        <div className="card">
          <h3>Total Dividends</h3>
          <p className="value">2145</p>
          <p className="change">+14% inc</p>
          <div className="progress-circle">+74%</div>
        </div>
      </div>

      {/* Payment History and Notifications/Calendar Section */}
      <div className="main-content">
        {/* Payment History */}
        <div className="payment-history">
          <div className="payment-header">
            <h3>Payment History</h3>
            <div className="time-range">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  className={selectedTimeRange === range ? "active" : ""}
                  onClick={() => setSelectedTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="payment-stats">
            <p className="total">$12,135.69</p>
            <p className="change">+23% vs last month</p>
          </div>
          <div className="chart-container">
            <Line
              data={paymentHistoryData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `$${context.parsed.y}`,
                    },
                  },
                },
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { display: false }, beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        {/* Notifications and Calendar */}
        <div className="sidebar">
          {/* Notifications */}
          <div className="notifications">
            <h3>
              Notifications <span className="badge">6</span>
            </h3>
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <span className="icon">{notification.icon}</span>
                  {notification.message}
                </li>
              ))}
            </ul>
          </div>

          {/* Calendar */}
          <div className="calendar">
            <div className="calendar-header">
              <button>&lt;</button>
              <h3>March 2025</h3>
              <button>&gt;</button>
            </div>
            <div className="calendar-grid">
              <div className="day-label">S</div>
              <div className="day-label">M</div>
              <div className="day-label">T</div>
              <div className="day-label">W</div>
              <div className="day-label">T</div>
              <div className="day-label">F</div>
              <div className="day-label">S</div>
              {calendarDays.map((day) => (
                <div
                  key={day}
                  className={`day ${
                    highlightedDates.includes(day) ? "highlighted" : ""
                  } ${day === 22 ? "today" : ""}`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDashboard;
