import React from "react";
import { Route, Navigate } from "react-router-dom";
import LayoutEmployee from "../layouts/LayoutEmployee";
import MyProfile from "../components/Employee/MyProfile";
import MyPayroll from "../components/Employee/MyPayroll";

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
    </Route>
];

export default EmployeeRoutes;
