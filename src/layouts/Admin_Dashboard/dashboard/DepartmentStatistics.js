import React from "react";
import "./DepartmentStatistics.css";

const DepartmentStatistics = ({
  earnings = 6078.76,
  profitPercentage = 48,
  meterPercentage = 80,
}) => {
  return (
    <div className="department-statistics">
      <h2 className="title">Employees by Department</h2>
      <div className="earnings-card">
        <div className="earnings-body">
          <div className="heading">
            <h3>Earnings</h3>
            <span className="subtitle">Total Expense</span>
          </div>
          <div className="amount">${earnings.toFixed(2)}</div>
          <p className="profit-text">
            Profit is {profitPercentage}% More than last Month
          </p>
        </div>
        <div className="percentage-meter">
          <div className="meter-circle">
            <div className="meter-background"></div>
            <div
              className="meter-fill"
              style={{
                transform: `rotate(${(meterPercentage / 100) * 360}deg)`,
              }}
            ></div>
            <div className="meter-line"></div>
            <span className="percentage">{meterPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentStatistics;
