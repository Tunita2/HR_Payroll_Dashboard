import React from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import ReportTitle from "./ReportTitle";
import ChartsSection_SummaryCards from "./ChartsSection_SummaryCards";
import FilterSection from "./FilterSection";
import "./ReportLayout.css";

const ReportLayout = () => {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <ReportTitle />
          <FilterSection />
          <ChartsSection_SummaryCards />
        </div>
      </div>
    </div>
  );
};

export default ReportLayout;
