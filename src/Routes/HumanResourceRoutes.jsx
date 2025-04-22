import React from "react";
import { Routes, Route } from "react-router-dom";
import LayoutHumanResource from "../layouts/LayoutHumanResource";
import HR_EmployeeTable from "../components/HumanResource/HR_EmployeeTable";
import HR_DividendTable from "../components/HumanResource/HR_DividendTable";
import HR_PositionTable from "../components/HumanResource/HR_PositionTable";
import HR_DepartmentTable from "../components/HumanResource/HR_DepartmentTable";
import HR_Report from "../components/HumanResource/HR_Report";

const HumanResourceRoutes = () => {
  return (
    <Routes>
      <Route element={<LayoutHumanResource />}>
        <Route path="employee" element={<HR_EmployeeTable />} />
        <Route path="dividend" element={<HR_DividendTable />} />
        <Route path="position" element={<HR_PositionTable />} />
        <Route path="department" element={<HR_DepartmentTable />} />
        <Route path="report" element={<HR_Report />} />
      </Route>
    </Routes>
  );
};

export default HumanResourceRoutes;
