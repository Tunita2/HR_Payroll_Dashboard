import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import PayrollRoutes from "./Routes/PayrollRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import HumanResourceRoutes from "./Routes/HumanResourceRoutes";
import EmployeeRoutes from "./Routes/EmployeeRoutes";
import Login from "./Login/Login";
import EmployeeLayout from"./layouts/LayoutEmployee"
function App() {
  return (
    <Router>
      <Routes>
        <>
          <Route path="/" element={<Login />} />
          {AdminRoutes()}
          {EmployeeRoutes()}
          {PayrollRoutes()}
          {HumanResourceRoutes()}
        </>
      </Routes>
    </Router>

    // <div className = "App">
    //   <HumanResourceRoutes/>
    // </div>
  );
}

export default App;
