import React from "react";
import { Routes, Route } from "react-router-dom";
import LayoutEmployee from "../layouts/LayoutEmployee";
import MyProfile from "../components/Employee/MyProfile";
import MyPayroll from "../components/Employee/MyPayroll";
import LeaveWork from "../components/Employee/LeaveDays_WorkStatus";
import Notifications from "../components/Employee/Notifications";
import CelebInfo from "../components/Employee/CelebInfo";

const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route element={<LayoutEmployee />}>
        <Route index element={<MyProfile />} />
        <Route path="my-payroll" element={<MyPayroll />} />
        <Route path="leave-work" element={<LeaveWork />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="celeb-info" element={<CelebInfo />} />
      </Route>
    </Routes>
  );
};

export default EmployeeRoutes;
