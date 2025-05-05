import React from "react";
import { Route } from "react-router-dom";
import LayoutPayroll from "../layouts/LayoutPayroll";
import { ProtectedRoute } from "../Login/Login";
import SalaryTable from "../components/Payroll/SalaryTable";
import AttendanceTable from "../components/Payroll/AttendanceTable";
import Report from "../components/Payroll/Report";
import Schedules from "../components/Payroll/Schedules";
import PayrollHistory from "../components/Payroll/History";

const PayrollRoutes = () => {
  return (
    <Route path="/payroll" element={
      <ProtectedRoute allowedRoles="payroll">
        <LayoutPayroll />
      </ProtectedRoute>
    }>
      <Route path="salary" element={<SalaryTable />} />
      <Route path="salary/history" element={<PayrollHistory />} />
      <Route path="attendance" element={<AttendanceTable />} />
      <Route path="schedule" element={<Schedules />} />
      <Route path="report" element={<Report />} />
    </Route>
  );
};

export default PayrollRoutes;
