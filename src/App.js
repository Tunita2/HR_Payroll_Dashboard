import Login from "./pages/Login";
import PayrollView from "./pages/PayrollView";
// import EmployeeLayout from "./layouts/Admin_Dashboard/employee/EmployeeLayout";
import PayrollLayout from "./layouts/Admin_Dashboard/payroll/PayrollLayout";
import AttendanceLayout from "./layouts/Admin_Dashboard/attendance/AttendanceLayout";
import ReportLayout from "./layouts/Admin_Dashboard/report/ReportLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import EmployeeDashboardLayout from "./layouts/Employee_Dashboard/MyProfile/EmployeeDashboardLayout";
import DashboardLayout from "./layouts/Employee_Dashboard/LeaveWork/DashboardLayout";
import CelebInfoDashboard from "./layouts/Employee_Dashboard/CelebInfo/EmployeeDashboardLayout";
import NotifDashboard from "./layouts/Employee_Dashboard/Notifications/DashboardLayout";
import Layout from "./layouts/Employee_Dashboard/MyPayroll/Layout";
import HistoryLayout from "./layouts/Employee_Dashboard/HistoryPayroll/Layout";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Các route */}
          <Route path="/payroll" element={<PayrollLayout />} />
          {/* <Route path="/employee" element={<EmployeeLayout />} /> */}
          <Route path="/attendance" element={<AttendanceLayout />} />
          <Route path="/report" element={<ReportLayout />} />
          <Route path="/payroll-view" element={<PayrollView />} />

          {/* Route trang chu */}
          <Route path="/" element={<Login />} />
        </Routes>
        {/* <PayrollView /> */}
        {/* <PayrollDashboard /> */}
        {/* <EmployeeLayout /> */}
        {/* <PayrollLayout /> */}
        {/* <AttendanceLayout /> */}
        {/* { <EmployeeDashboardLayout /> } */}
        {/* {<ReportLayout />} */}
        {/* {<DashboardLayout/>} */}
        {/* {<CelebInfoDashboard/>} */}
        {/* {<NotifDashboard/>} */}
        {/* {<Layout/>} */}
        {/* {<HistoryLayout/>} */}
      </div>
    </Router>
  );
}

export default App;
