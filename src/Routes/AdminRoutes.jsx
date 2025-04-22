import React from "react";
import { Routes, Route } from "react-router-dom";
import LayoutAdmin from "../layouts/LayoutAdmin";
import AdminDashboard from "../components/Admin/AdminDashboard";
// HR
import EmployeeTable from "../components/Admin/HumanResource/EmployeeTable";
import DividendTable from "../components/Admin/HumanResource/DividendTable";
import DepartmentTable from "../components/Admin/HumanResource/DepartmentTable";
import PositionTable from "../components/Admin/HumanResource/PositionTable";
// Payroll
import SalaryTable from "../components/Admin/Payroll/SalaryTable";
import AttendanceTable from "../components/Admin/Payroll/AttendanceTable";
// General
import Reports from "../components/Admin/Reports";
import Alerts from "../components/Admin/Alerts";
import Notifications from "../components/Admin/Notifications";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<LayoutAdmin />}>
        <Route index element={<AdminDashboard />} />
        <Route path="employees" element={<EmployeeTable />} />
        <Route path="dividends" element={<DividendTable />} />
        <Route path="departments" element={<DepartmentTable />} />
        <Route path="positions" element={<PositionTable />} />
        <Route path="salaries" element={<SalaryTable />} />
        <Route path="attendances" element={<AttendanceTable />} />
        <Route path="reports" element={<Reports />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
