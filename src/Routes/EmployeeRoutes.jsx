import React from "react";
import { Route } from "react-router-dom";
import LayoutEmployee from "../layouts/LayoutEmployee";
import MyPayroll from "../components/Employee/MyPayroll";
import LeaveWork from "../components/Employee/LeaveDays_WorkStatus";
import Notifications from "../components/Employee/Notifications";

const EmployeeRoutes = () => [
    <Route key="employee" path="/employee" element={<LayoutEmployee />}>
        <Route path="my-payroll" element={<MyPayroll />} />
        <Route path="leave-work" element={<LeaveWork />} />
        <Route path="notifications" element={<Notifications />} />
    </Route>
];

export default EmployeeRoutes;
