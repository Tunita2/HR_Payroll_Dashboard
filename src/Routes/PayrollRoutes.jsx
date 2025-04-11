import React from "react";
import { Route } from "react-router-dom";
import LayoutPayroll from "../layouts/LayoutPayroll";
import SalaryTable from "../components/Payroll/SalaryTable";
import AttendanceTable from "../components/Payroll/AttendanceTable";
import Report from "../components/Payroll/Report";
import Schedules from "../components/Payroll/Schedules";

const PayrollRoutes = () => {
  return (
    <Route path="/payroll" element={<LayoutPayroll />}>
      <Route path="salary" element={<SalaryTable />} />
      <Route path="attendance" element={<AttendanceTable />} />
      <Route path="schedule" element={<Schedules />} />
      <Route path="report" element={<Report />} />
    </Route>
  );
};

export default PayrollRoutes;
