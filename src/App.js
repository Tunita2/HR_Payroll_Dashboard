import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import PayrollView from "./layouts/Payroll_Dashboard/PayrollList/PayrollLayout";
import Admin_Employee_Management from "./layouts/Admin_Dashboard/employee/AdminEmployeeLayout";
import Add_Employee_Page from "./layouts/HR_Dashboard/page/Add_Employee_PageLayout";
import Admin_Attendance_Management from "./layouts/Admin_Dashboard/attendance/AdminAttendanceLayout"
import LayoutHR_Dashboard from "./layouts/LayoutHR_Dashboard";
import LayoutAdmin_Dashboard from "./layouts/LayoutAdmin_Dashboard";
import AttendancePage from "./pages/Payroll-pages/Attendance_page";
import ReportPayrollPage from "./pages/Payroll-pages/ReportPayroll_page";
import PayrollDashboardPage from "./pages/Payroll-pages/PayrollDashboard_page";
import SalariesPage from "./pages/Payroll-pages/Salaries_page";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/payroll-management" element={<PayrollView />} />
          <Route path="/admin/employee-management" element={<Admin_Employee_Management />} />
          <Route path="/admin/employee-management/add_employee" element={<Add_Employee_Page />} />
          <Route path="/admin/attendance-management" element={<Admin_Attendance_Management />} />
    
          <Route path="/hr-dashboard" element={<LayoutHR_Dashboard />} />
          <Route path="/admin-dashboard" element={<LayoutAdmin_Dashboard />} />
          {/* Route Payroll */}
          <Route path="/attendance" element={<AttendancePage/>}/>
          <Route path="/payroll-dashboard" element={<PayrollDashboardPage/>}/>
          <Route path="/payroll-report" element={<ReportPayrollPage/>}/>
          <Route path="/salary" element={<SalariesPage />} />
          {/* Route login */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
