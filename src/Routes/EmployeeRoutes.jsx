import React from "react";
import { Route } from "react-router-dom";
import LayoutEmployee from "../layouts/LayoutEmployee";
import MyProfile from "../components/Employee/MyProfile";
import MyPayroll from "../components/Employee/MyPayroll";
import { ProtectedRoute } from "../Login/Login";

const EmployeeRoutes = () => [
    <Route key="employee" path="/employee" element={
        <ProtectedRoute allowedRoles="employee">
            <LayoutEmployee />
        </ProtectedRoute>
    }>
        <Route index element={<MyProfile />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="my-payroll" element={<MyPayroll />} />
    </Route>
];

export default EmployeeRoutes;
