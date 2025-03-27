import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";

import PayrollView from "./pages/PayrollView";

// import EmployeeLayout from "./layouts/Admin_Dashboard/employee/EmployeeLayout";
import PayrollLayout from "./layouts/Admin_Dashboard/payroll/PayrollLayout";
import AttendanceLayout from "./layouts/Admin_Dashboard/attendance/AttendanceLayout";
import ReportLayout from "./layouts/Admin_Dashboard/report/ReportLayout";
import DashboardAdmin from "./layouts/Admin_Dashboard/dashboard/DashboardLayout";

import EmployeeDashboardLayout from "./layouts/Employee_Dashboard/MyProfile/EmployeeDashboardLayout";
import DashboardLayout from "./layouts/Employee_Dashboard/LeaveWork/DashboardLayout";
import CelebInfoDashboard from "./layouts/Employee_Dashboard/CelebInfo/EmployeeDashboardLayout";
import NotifDashboard from "./layouts/Employee_Dashboard/Notifications/DashboardLayout";
import Layout from "./layouts/Employee_Dashboard/MyPayroll/Layout";
import HistoryLayout from "./layouts/Employee_Dashboard/HistoryPayroll/Layout";
// Admin
// import AdminEmployeeLayout from "./layouts/Admin_Dashboard/employee/AdminEmployeeLayout";
// import AdminPayrollLayout from "./layouts/Admin_Dashboard/payroll/AdminPayrollLayout";
// import AdminAttendanceLayout from "./layouts/Admin_Dashboard/attendance/AdminAttendanceLayout";
// import AdminReportLayout from "./layouts/Admin_Dashboard/report/AdminReportLayout";
// import AdminDashboardLayout from "./layouts/Admin_Dashboard/dashboard/AdminDashboardLayout";

// Payroll
import PayrollLayout from "./layouts/Payroll_Dashboard/PayrollList/PayrollLayout";
import PayrollDashboardLayout from "./layouts/Payroll_Dashboard/dashboard/PayrollDashboardLayout";
import PayrollHistoryLayout from "./layouts/Payroll_Dashboard/PayrollHistory/PayrollHistoryLayout";
import AttendanceLayout from "./layouts/Payroll_Dashboard/AttendanceList/AttendanceLayout";
import ReportLayout from "./layouts/Payroll_Dashboard/Report/ReportLayout";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Các route */}
          <Route path="/payroll" element={<PayrollLayout />} />
          {/* <Route path="/employee" element={<EmployeeLayout />} /> */}
          <Route path="/attendance" element={<AttendanceLayout />} />
          {/* report của role nào đây */}
          <Route path="/report" element={<ReportLayout />} />
          <Route path="/employee" element={<EmployeeDashboardLayout />} />
          {/* dashboard của role nào đây */}
          <Route path="/dashboard-layout" element={<DashboardLayout />} />
          {/* kỉ niệm của role nào đây */}
          <Route path="/celeb-info" element={<CelebInfoDashboard />} />
          {/* thông báo của role nào đây */}
          <Route path="/notification" element={<NotifDashboard />} />
          {/* history của role nào đây */}
          <Route path="/historty-layout" element={<HistoryLayout />} />


          <Route path="/hr-manager" element={<CelebInfoDashboard />} />
          <Route path="/payroll-manager" element={<PayrollView />} />
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/employee" element={<Layout />} />
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
        {/* Admin */}
        {/* <AdminEmployeeLayout /> */}
        {/* <AdminPayrollLayout /> */}
        {/* <AdminAttendanceLayout /> */}
        {/* <AdminReportLayout /> */}
        {/* <AdminDashboardLayout /> */}

        {/* Payroll */}
        {/* <PayrollLayout /> */}
        {/* <PayrollDashboardLayout /> */}
        {/* <PayrollHistoryLayout /> */}
        {/* <AttendanceLayout /> */}
        {/* <ReportLayout /> */}
      </div>
    </Router>
  );
}

export default App;
