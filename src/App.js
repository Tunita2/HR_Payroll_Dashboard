import PayrollView from "./pages/PayrollView";
import EmployeeLayout from "./layouts/Admin_Dashboard/employee/EmployeeLayout";
import PayrollLayout from "./layouts/Admin_Dashboard/payroll/PayrollLayout";
import AttendanceLayout from "./layouts/Admin_Dashboard/attendance/AttendanceLayout";
import ReportLayout from "./layouts/Admin_Dashboard/report/ReportLayout";
import DashboardLayout from "./layouts/Admin_Dashboard/dashboard/DashboardLayout";

function App() {
  return (
    <div className="App">
      {/* <PayrollView /> */}
      {/* <EmployeeLayout /> */}
      {/* <PayrollLayout /> */}
      {/* <AttendanceLayout /> */}
      {/* <ReportLayout /> */}
      <DashboardLayout />
    </div>
  );
}

export default App;
