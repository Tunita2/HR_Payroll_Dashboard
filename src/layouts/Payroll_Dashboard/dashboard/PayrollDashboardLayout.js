import React from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import PaymentHistoryChart_StatisticsCards from "./PaymentHistoryChart_StatisticsCards";
import Notifications from "./Notifications";
import Calendar from "./Calendar";
import "./PayrollDashboardLayout.css"; // Import file CSS

const PayrollDashboardLayout = () => {
  return (
    <div className="payroll-dashboard">
      <Header className="header" />
      <div className="content-container">
        <Sidebar className="sidebar" />
        <div className="main-content">
          <PaymentHistoryChart_StatisticsCards className="payment-history" />
          <div className="bottom-section">
            <Notifications className="notifications" />
            <Calendar className="calendar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboardLayout;
