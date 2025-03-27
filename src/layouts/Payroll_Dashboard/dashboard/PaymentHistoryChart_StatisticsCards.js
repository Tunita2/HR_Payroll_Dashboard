import React from "react";
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
import "./PaymentHistoryChart_StatisticsCards.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PaymentHistoryChart_StatisticsCards = ({
  employeeCount = "5672",
  salaryBudget = "234",
  upcomingAnniversary = "3567",
  dividends = "2145",
}) => {
  const chartData = {
    labels: ["Feb 1", "Feb 8", "Feb 15", "Feb 22", "Feb 28"],
    datasets: [
      {
        data: [3000, 4000, 4251, 3800, 3500],
        borderColor: "#0aaf60",
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
      },
    },
  };

  const statCards = [
    {
      title: "Total Employee",
      value: employeeCount,
      increase: "+14% Inc",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-Se0h_Ow-G566nP/group-1.png",
    },
    {
      title: "Total Salary Budget",
      value: salaryBudget,
      increase: "+14% Inc",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-Se0h_Ow-G566nP/group-1-2.png",
    },
    {
      title: "Total Upcoming Aniversary",
      value: upcomingAnniversary,
      increase: "+14% Inc",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-Se0h_Ow-G566nP/group-1-3.png",
    },
    {
      title: "Total Dividends",
      value: dividends,
      increase: "+14% Inc",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-Se0h_Ow-G566nP/group-1-4.png",
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="stats-row">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <h3>{card.title}</h3>
                <h2>{card.value}</h2>
                <div className="stat-increase">
                  <div className="trend-icon">
                    <img src={card.icon} alt="trend" />
                  </div>
                  <span>{card.increase}</span>
                </div>
              </div>
              <div className="stat-chart">
                <div className="percentage">+74%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <h2>Payment History</h2>
          <div className="timeframe-buttons">
            <button className="active">1M</button>
            <button>3M</button>
            <button>6M</button>
            <button>1Y</button>
          </div>
        </div>

        <div className="chart-value">
          <h1>$12,135.69</h1>
          <div className="chart-badge">
            <span className="badge">+23%</span>
            <span className="vs-text">vs last month</span>
          </div>
        </div>

        <div className="chart-wrapper">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryChart_StatisticsCards;
