import React from "react";
import "./ChartsSectionReportSummary.css";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ChartsSectionReportSummary = ({
  totalEmployees = 5000,
  totalPayrollBudget = "$285,750",
  totalDividends = "$43,750",
}) => {
  // Summary data
  const summaryData = [
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z-LUJN4gt92eP1Vw/icon.png",
      title: "Total employee",
      value: totalEmployees,
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z-LUJN4gt92eP1Vw/icon-2.png",
      title: "Total payroll budget",
      value: totalPayrollBudget,
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z-LUJN4gt92eP1Vw/icon-3.png",
      title: "Total Dividends",
      value: totalDividends,
    },
  ];

  // Employee chart data
  const employeeData = {
    labels: ["IT", "Marketing", "Human Resource", "Accounting", "Sale"],
    datasets: [
      {
        data: [39.1, 25, 22, 6.2, 8],
        backgroundColor: [
          "#67c587",
          "#eaf6ed",
          "#88d1a1",
          "#c9ead4",
          "#aef6c5",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Payroll trend data
  const payrollData = {
    labels: ["Nov 2024", "Dec 2024", "Jan 2025", "Feb2025", "Mar 2025"],
    datasets: [
      {
        label: "Payroll Trend",
        data: [200, 350, 450, 300, 400],
        fill: true,
        borderColor: "#39cef3",
        backgroundColor: "rgba(57, 206, 243, 0.1)",
        tension: 0.4,
      },
    ],
  };

  // Shareholder dividend data
  const dividendData = {
    labels: [
      "Shareholder Dividends",
      "Reserve Funds",
      "Employee Bonuses & Benefits",
      "Reinvestment in Business",
    ],
    datasets: [
      {
        data: [30, 25, 20, 10],
        backgroundColor: ["#ff703b", "#39cef3", "#39cef3", "#9ad960"],
        borderWidth: 0,
      },
    ],
  };

  // Revenue comparison data
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Last Month",
        data: [65, 75, 70, 80, 75, 85],
        borderColor: "#a9dfd8",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: "This Month",
        data: [70, 80, 75, 85, 80, 90],
        borderColor: "#f2c8ed",
        backgroundColor: "transparent",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="charts-section">
      {/* Summary Cards */}
      <div className="summary-cards">
        {summaryData.map((item, index) => (
          <div key={index} className="summary-card">
            <img src={item.icon} alt={item.title} className="card-icon" />
            <div className="card-content">
              <p className="card-title">{item.title}</p>
              <h2 className="card-value">{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Employee Chart */}
        <div className="chart-container">
          <h3>Employee chart</h3>
          <div className="pie-chart">
            <Pie
              data={employeeData}
              options={{ plugins: { legend: { display: false } } }}
            />
          </div>
        </div>

        {/* Payroll Trend Chart */}
        <div className="chart-container">
          <h3>Payroll trend chart</h3>
          <Line
            data={payrollData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  max: 500,
                  ticks: { stepSize: 100 },
                },
              },
              plugins: { legend: { display: false } },
            }}
          />
        </div>

        {/* Shareholder Dividend Chart */}
        <div className="chart-container">
          <h3>Shareholder Dividend Chart</h3>
          <div className="pie-chart">
            <Pie
              data={dividendData}
              options={{ plugins: { legend: { display: false } } }}
            />
          </div>
        </div>

        {/* Revenue Comparison Chart */}
        <div className="chart-container">
          <h3>Comparative Revenue Charts</h3>
          <Line
            data={revenueData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartsSectionReportSummary;
