import Login from "./pages/Login";
import PayrollView from "./pages/PayrollView";
// import EmployeeLayout from "./layouts/Admin_Dashboard/employee/EmployeeLayout";
import PayrollLayout from "./layouts/Admin_Dashboard/payroll/PayrollLayout";
import AttendanceLayout from "./layouts/Admin_Dashboard/attendance/AttendanceLayout";
import ReportLayout from "./layouts/Admin_Dashboard/report/ReportLayout";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
      </div>
    </Router>
  );
}

export default App;
