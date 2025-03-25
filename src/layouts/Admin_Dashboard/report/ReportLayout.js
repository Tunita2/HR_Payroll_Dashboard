import React from "react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import ChartsSection_ReportSummary from "./ChartsSectionReportSummary";
import "./ReportLayout.css";

const ReportLayout = () => {
  return (
    <div className="report-layout-container">
      <Sidebar className="sidebar" />
      <div className="report-content">
        <Header className="header" />
        <ChartsSection_ReportSummary className="charts-section" />
      </div>
    </div>
  );
};

export default ReportLayout;
