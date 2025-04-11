import React from "react";
import { Route } from "react-router-dom";
import LayoutAdmin from "../layouts/LayoutAdmin";
// HR
import StaffTable from "../components/Admin/HumanResource/StaffTable";
import ApplicantTable from "../components/Admin/HumanResource/ApplicantTable";
import DepartmentTable from "../components/Admin/HumanResource/DepartmentTable";
import JobTitleTable from "../components/Admin/HumanResource/JobTitleTable";
// Payroll
import SalaryTable from "../components/Admin/Payroll/SalaryTable";
import AttendanceTable from "../components/Admin/Payroll/AttendanceTable";
// General
import Reports from "../components/Admin/Reports";
import AlertNotifications from "../components/Admin/AlertNotifications";

const AdminRoutes = () => {
  return (
    <Route path="/admin" element={<LayoutAdmin />}>
          <Route path="staffs" element={<StaffTable />} />
          <Route path="applicants" element={<ApplicantTable />} />
          <Route path="departments" element={<DepartmentTable />} />
          <Route path="jobtitles" element={<JobTitleTable />} />
          <Route path="salaries" element={<SalaryTable />} />
          <Route path="attendances" element={<AttendanceTable />} />
          <Route path="reports" element={<Reports />} />
          <Route
            path="alerts-and-notifications"
            element={<AlertNotifications />}
          />
    </Route>
  );
};

export default AdminRoutes;
