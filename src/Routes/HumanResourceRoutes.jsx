import React from "react";
import { Route } from "react-router-dom";
import LayoutHumanResource from "../layouts/LayoutHumanResource";
import StaffTable from "../components/HumanResource/StaffTable";
import ApplicantTable from "../components/HumanResource/ApplicantTable";
import DepartmentTable from "../components/HumanResource/DepartmentTable";
import JobTitleTable from "../components/HumanResource/JobTitleTable";
import Report from "../components/HumanResource/Report"

const HumanResourceRoutes = () => {
  return (
    <Route path="/human-resource" element={<LayoutHumanResource />}>
      <Route path="staff" element={<StaffTable />} />
      <Route path="applicant" element={<ApplicantTable />} />
      <Route path="department" element={<DepartmentTable />} />
      <Route path="jobtitle" element={<JobTitleTable />} />
      <Route path="report" element={<Report />} />
    </Route>
  );
};

export default HumanResourceRoutes;
