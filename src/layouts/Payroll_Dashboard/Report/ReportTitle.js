import React from "react";
import "./ReportTitle.css";

const ReportTitle = ({ title = "Report" }) => {
  return (
    <div className="report-title">
      <h1>{title}</h1>
    </div>
  );
};

export default ReportTitle;
