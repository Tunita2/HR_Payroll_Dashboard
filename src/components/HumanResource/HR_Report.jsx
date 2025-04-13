import React, { useState } from 'react';

import "../../styles/HumanResourceStyles/HR_Report.css";

const HR_Report = ({ style = {} }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = [
    { id: "overview", label: "Overview", width: "150px" },
    { id: "detailStaff", label: "Detail Staff", width: "150px" },
    { id: "hrMovement", label: "HR Movement Statistics", width: "250px" },
    { id: "notes", label: "Notes", width: "150px" },
  ];

  const cards = [
    { title: "Total Employees", value: "155" },
    { title: "Total Department", value: "15" },
    { title: "Total Position", value: "20" },
    { title: "Total Male", value: "110" },
    { title: "Total Female", value: "40" },
  ];

  return (
    <div className="dashboard-layout-report">
      <div className="dashboard-main">
        {/* Phần header - đầu của report */}
        <div className="dashboard-header-report">
          <div className="dashboard-title-report">Report</div>

          {/* Phần hiển thị thông tin nơi làm */}
          <div className="report-details-container">
            <div className="report-details-row">
              <span className="report-details-label">Company name</span>
              <span className="report-details-colon">:</span>
              <span className="report-details-value">FPT Software</span>
            </div>
            <div className="report-details-row">
              <span className="report-details-label">Department/Division</span>
              <span className="report-details-colon">:</span>
              <span className="report-details-value">Human Resources</span>
            </div>
            <div className="report-details-row">
              <span className="report-details-label">Report date</span>
              <span className="report-details-colon">:</span>
              <span className="report-details-report-date">05/04/2025</span>
            </div>
            <div className="report-details-row">
              <span className="report-details-label">Report prepared by</span>
              <span className="report-details-colon">:</span>
              <span className="report-details-value">Minh</span>
            </div>
          </div>
        </div>

        {/* Phần hiển thị các mục tùy chọn của report */}
        <div className="tabs-container">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab-button ${
                activeTab === tab.label ? "active" : "inactive"
              }`}
              style={{ width: tab.width }}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}
            </div>
          ))}
        </div>

        {/* Đường line chia */}
        <div class="line">
          <hr />
        </div>

        {/* Phần hiển thị dữ liệu report */}
        <div className="card-container">
          {cards.map((card, index) => (
            <div
              key={index}
              className="card"
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <p className="card-title">{card.title}</p>
              <p className="card-value">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

HR_Report.defaultProps = {
  style: {},
};

export default HR_Report;
