import React from "react";
import "./ChartsSection_SummaryCards.css";

const ChartsSection_SummaryCards = ({ style = {} }) => {
  const summaryData = [
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z-TCwR_Ow-G566nh/icon.png",
      title: "Total salary budget",
      value: "$500,000,000",
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z-TCwR_Ow-G566nh/icon-2.png",
      title: "Current Monthly Payroll",
      value: "$285,750",
    },
    {
      icon: "https://dashboard.codeparrot.ai/api/image/Z-TCwR_Ow-G566nh/icon-3.png",
      title: "Company Avgerage Salary",
      value: "$43,750",
    },
  ];

  return (
    <div className="charts-section" style={style}>
      <div className="summary-cards">
        {summaryData.map((item, index) => (
          <div key={index} className="summary-card">
            <img src={item.icon} alt="" className="card-icon" />
            <div className="card-content">
              <div className="card-title">{item.title}</div>
              <div className="card-value">{item.value}</div>
            </div>
            {index < summaryData.length - 1 && <div className="card-divider" />}
          </div>
        ))}
      </div>

      <div className="charts-container">
        <div className="pie-chart-section">
          <h3 className="chart-title">Salary Breakdown by Department</h3>
          <div className="pie-chart">
            <img
              src="https://dashboard.codeparrot.ai/api/image/Z-TCwR_Ow-G566nh/figpie.png"
              alt="Pie Chart"
              className="pie-image"
            />
            <div className="legend">
              <div className="legend-item">
                <div
                  className="indicator"
                  style={{ background: "#67c587" }}
                ></div>
                <span>VAT</span>
              </div>
              <div className="legend-item">
                <div
                  className="indicator"
                  style={{ background: "#eaf6ed" }}
                ></div>
                <span>WHT</span>
              </div>
              <div className="legend-item">
                <div
                  className="indicator"
                  style={{ background: "#88d1a1" }}
                ></div>
                <span>Corporate Taxes</span>
              </div>
              <div className="legend-item">
                <div
                  className="indicator"
                  style={{ background: "#c9ead4" }}
                ></div>
                <span>CIT</span>
              </div>
              <div className="legend-item">
                <div
                  className="indicator"
                  style={{ background: "#aef6c5" }}
                ></div>
                <span>Other Indirect Taxes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="line-chart-section">
          <h3 className="chart-title">Monthly Payroll Trend</h3>
          <div className="line-chart">
            <div className="y-axis">
              {[500, 400, 300, 200, 100, 0].map((value, index) => (
                <div key={index} className="axis-label">
                  {value}
                </div>
              ))}
            </div>
            <img
              src="https://dashboard.codeparrot.ai/api/image/Z-TCwR_Ow-G566nh/graph.png"
              alt="Line Graph"
              className="graph-image"
            />
            <div className="x-axis">
              {["Nov 2024", "Dec 2024", "Jan 2025", "Feb2025", "Mar 2025"].map(
                (month, index) => (
                  <div key={index} className="axis-label">
                    {month}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection_SummaryCards;
