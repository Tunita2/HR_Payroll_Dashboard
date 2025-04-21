import React from "react";
import { Route } from "react-router-dom";
import LayoutAdmin from "../layouts/LayoutAdmin";
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
// import AlertsAndNotifications from "../components/Admin/AlertsAndNotifications";
import Alerts from "../components/Admin/Alerts";
import Notifications from "../components/Admin/Notifications";

const AdminRoutes = () => {
  return (
    <Route path="/admin" element={<LayoutAdmin />}>
          <Route path="employees" element={<EmployeeTable />} />
          <Route path="dividends" element={<DividendTable />} />
          <Route path="departments" element={<DepartmentTable />} />
          <Route path="positions" element={<PositionTable />} />
          <Route path="salaries" element={<SalaryTable />} />
          <Route path="attendances" element={<AttendanceTable />} />
          <Route path="reports" element={<Reports />} />
          <Route path="alerts" element={<Alerts />}/>
          <Route path="notifications" element={<Notifications />}/>
    </Route>
  );
};

export default AdminRoutes;
