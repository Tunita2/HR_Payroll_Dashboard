import React from "react";
import { Route, Navigate } from "react-router-dom";
import LayoutEmployee from "../layouts/LayoutEmployee";
import MyProfile from "../components/Employee/MyProfile";
import MyPayroll from "../components/Employee/MyPayroll";
import LeaveWork from "../components/Employee/LeaveDays_WorkStatus";
import Notifications from "../components/Employee/Notifications";

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/" />;
    }

    if (role !== 'employee') {
        // Redirect based on role
        if (role === 'admin') return <Navigate to="/admin" />;
        if (role === 'hr') return <Navigate to="/human" />;
        if (role === 'payroll') return <Navigate to="/payroll" />;
    }

    return children;
};

const EmployeeRoutes = () => [
    <Route key="employee" path="/employee" element={
        <ProtectedRoute>
            <LayoutEmployee />
        </ProtectedRoute>
    }>
        <Route index element={<MyProfile />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="my-payroll" element={<MyPayroll />} />
        <Route path="leave-work" element={<LeaveWork />} />
        <Route path="notifications" element={<Notifications />} />
    </Route>
];

export default EmployeeRoutes;
