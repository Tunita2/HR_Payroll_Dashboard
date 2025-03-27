import React from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import SearchBar from "./SearchBar";
import FilterSection from "./FilterSection";
import PayrollHistoryTable from "./PayrollHistoryTable";
import "./PayrollHistoryLayout.css";

const PayrollHistoryLayout = () => {
  return (
    <div className="dashboard-layout">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content-area">
          <h1 className="title">Payroll history</h1>
          <div className="controls">
            <SearchBar />
            <FilterSection />
          </div>
          <PayrollHistoryTable />
        </div>
      </div>
    </div>
  );
};

export default PayrollHistoryLayout;
