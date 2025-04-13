import React from "react";
import { Route } from "react-router-dom";
import LayoutHumanResource from "../layouts/LayoutHumanResource";
import HR_EmployeeTable from "../components/HumanResource/HR_EmployeeTable";
import HR_DividendTable from "../components/HumanResource/HR_DividendTable";
import HR_PositionTable from "../components/HumanResource/HR_PositionTable";
import HR_DepartmentTable from "../components/HumanResource/HR_DepartmentTable";
import HR_Report from "../components/HumanResource/HR_Report";

const HumanResourceRoutes = () => {
  return (
    <Route path="/human" element={<LayoutHumanResource />}>
      <Route path="/human/employee" element={<HR_EmployeeTable />} />
      <Route path="/human/dividend" element={<HR_DividendTable />} />
      <Route path="/human/position" element={<HR_PositionTable />} />
      <Route path="/human/department" element={<HR_DepartmentTable />} />
      <Route path="/human/report" element={<HR_Report />} />
    </Route>
  );
};

export default HumanResourceRoutes;
