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
    <div className="App">
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
      <ReportLayout />
    </div>
  );
}

export default App;
