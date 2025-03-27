import React from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import SummaryCards from "./SummaryCards";
import SearchBar from "./SearchBar";
import AttendanceTable from "./AttendanceTable";
import "./AttendanceLayout.css";

const AttendanceLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <SummaryCards />
        <SearchBar />
        <AttendanceTable />
      </div>
    </div>
  );
};

export default AttendanceLayout;
