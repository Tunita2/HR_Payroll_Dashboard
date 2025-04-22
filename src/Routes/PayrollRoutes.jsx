import React from "react";
import { Routes, Route } from "react-router-dom";
import LayoutPayroll from "../layouts/LayoutPayroll";
import PayrollDashboard from "../components/Payroll/PayrollDashboard";
import SalaryTable from "../components/Payroll/SalaryTable";
import AttendanceTable from "../components/Payroll/AttendanceTable";
import Schedules from "../components/Payroll/Schedules";
import Report from "../components/Payroll/Report";

const PayrollRoutes = () => {
  return (
    <Routes>
      <Route element={<LayoutPayroll />}>
        <Route index element={<PayrollDashboard />} />
        <Route path="salary" element={<SalaryTable />} />
        <Route path="attendance" element={<AttendanceTable />} />
        <Route path="schedule" element={<Schedules />} />
        <Route path="report" element={<Report />} />
      </Route>
    </Routes>
  );
};

export default PayrollRoutes;
