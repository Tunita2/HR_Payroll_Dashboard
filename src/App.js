import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./Login/Login";
import AdminRoutes from "./Routes/AdminRoutes";
import EmployeeRoutes from "./Routes/EmployeeRoutes";
import HumanResourceRoutes from "./Routes/HumanResourceRoutes";
import PayrollRoutes from "./Routes/PayrollRoutes";
import "./App.css";

const App = () => {
  // In a real app, this would come from your auth context
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole") || "";

  // If not authenticated, only allow access to login
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // Get the default route based on user role
  const getDefaultRoute = () => {
    switch (userRole) {
      case "ADMIN":
        return "/admin";
      case "HR_MANAGER":
        return "/hr";
      case "PAYROLL_OFFICER":
        return "/payroll";
      case "EMPLOYEE":
        return "/employee";
      default:
        return "/login";
    }
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Redirect root to appropriate dashboard based on role */}
          <Route
            path="/"
            element={<Navigate to={getDefaultRoute()} replace />}
          />

          {/* Module Routes - only show routes the user has access to */}
          {userRole === "ADMIN" && (
            <Route path="/admin/*" element={<AdminRoutes />} />
          )}
          {(userRole === "HR_MANAGER" || userRole === "ADMIN") && (
            <Route path="/hr/*" element={<HumanResourceRoutes />} />
          )}
          {(userRole === "PAYROLL_OFFICER" || userRole === "ADMIN") && (
            <Route path="/payroll/*" element={<PayrollRoutes />} />
          )}
          {userRole === "EMPLOYEE" && (
            <Route path="/employee/*" element={<EmployeeRoutes />} />
          )}

          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Fallback Route */}
          <Route
            path="*"
            element={<Navigate to={getDefaultRoute()} replace />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
