import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import PayrollView from "./layouts/Payroll_Dashboard/PayrollList/PayrollLayout";
import Admin_Employee_Management from "./layouts/Admin_Dashboard/employee/AdminEmployeeLayout";
import Add_Employee_Page from "./layouts/HR_Dashboard/page/Add_Employee_PageLayout";
import Admin_Attendance_Management from "./layouts/Admin_Dashboard/attendance/AdminAttendanceLayout"
import LayoutPayroll_Dashboard from "./layouts/LayoutPayroll_Dashboard";
import LayoutHR_Dashboard from "./layouts/LayoutHR_Dashboard";
import LayoutAdmin_Dashboard from "./layouts/LayoutAdmin_Dashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/payroll-management" element={<PayrollView />} />
          <Route path="/admin/employee-management" element={<Admin_Employee_Management />} />
          <Route path="/admin/employee-management/add_employee" element={<Add_Employee_Page />} />
          <Route path="/admin/attendance-management" element={<Admin_Attendance_Management />} />
          
          <Route path="/dashboard-layout" element={<LayoutPayroll_Dashboard />} />
          <Route path="/hr-dashboard" element={<LayoutHR_Dashboard />} />
          <Route path="/admin-dashboard" element={<LayoutAdmin_Dashboard />} />
          {/* Route login */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
