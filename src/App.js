import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import PayrollView from "./layouts/Payroll_Dashboard/PayrollList/PayrollLayout";
import Admin_Employee_Management from "./layouts/Admin_Dashboard/employee/AdminEmployeeLayout";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/payroll-manager" element={<PayrollView />} />
          <Route path="/admin/employee-management" element={<Admin_Employee_Management />} />
          {/* Route login */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
