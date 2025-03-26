import React from "react";
import "./DashboardMetrics.css";

const DashboardMetrics = () => {
  return (
    <div className="metrics-container">
      <div className="metrics-row">
        <div className="metric-card total-employees">
          <div className="metric-content">
            <div className="metric-info">
              <h3>Total Employee</h3>
              <h2>5672</h2>
              <div className="trend">
                <div className="trend-icon">
                  <img
                    src="https://dashboard.codeparrot.ai/api/image/Z-Opw94gt92eP1YN/icon-tre.png"
                    alt="trend"
                  />
                </div>
                <span>+14% Inc</span>
              </div>
            </div>
            <div className="chart">
              <img
                src="https://dashboard.codeparrot.ai/api/image/Z-Opw94gt92eP1YN/group-1.png"
                alt="chart"
              />
              <span className="percentage">+74%</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <h3>New Employees</h3>
            <h2>23</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <h3>Total Departments</h3>
            <h2>12</h2>
          </div>
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric-card wide">
          <div className="metric-content">
            <h3>Average Employee Salary</h3>
            <h2>$5,121.00</h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-content">
            <h3>Total Payroll Cost</h3>
            <h2>$2,345,600.00</h2>
          </div>
        </div>
      </div>

      <div className="metrics-row">
        <div className="metric-card wide">
          <div className="metric-content">
            <h3>Absence & Leave Rate</h3>
            <h2>3.2%</h2>
          </div>
        </div>

        <div className="metric-card extra-wide">
          <div className="metric-content">
            <h3>Average Working Days</h3>
            <h2>21.5</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
