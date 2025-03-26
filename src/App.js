// import PayrollView from "./pages/PayrollView";
// import EmployeeLayout from "./layouts/Admin_Dashboard/employee/EmployeeLayout";
// import PayrollLayout from "./layouts/Admin_Dashboard/payroll/PayrollLayout";
// import PayrollView from "./pages/PayrollView";
// import AttendanceLayout from "./layouts/Admin_Dashboard/attendance/AttendanceLayout";
import ReportLayout from "./layouts/Admin_Dashboard/report/ReportLayout";
import EmployeeDashboardLayout from "./layouts/Employee_Dashboard/MyProfile/EmployeeDashboardLayout";
import DashboardLayout from "./layouts/Employee_Dashboard/LeaveWork/DashboardLayout";
import CelebInfoDashboard from "./layouts/Employee_Dashboard/CelebInfo/EmployeeDashboardLayout";
import NotifDashboard from "./layouts/Employee_Dashboard/Notifications/DashboardLayout";
import Layout from "./layouts/Employee_Dashboard/MyPayroll/Layout";
import HistoryLayout from "./layouts/Employee_Dashboard/HistoryPayroll/Layout";
function App() {
  return (
    <div className="App">
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
      {<HistoryLayout/>}
    </div>
  );
}

export default App;
