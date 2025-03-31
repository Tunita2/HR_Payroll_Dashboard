import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./components/MainDashboard/DashboardLayout";
import StaffTable from "./components/Staff/StaffTable";
import ApplicantsTable from "./components/Applicants/ApplicantsTable";
import DepartmentTable from "./components/Department/Department";
import JobTable from "./components/JobTitle/JobTitle";

function App() {
  const [count, setCount] = useState(0);

  return (
    // <div class = "App">
    //   <Department />
    // </div>
    <Router>
      <Routes>
        {/* Dùng DashboardLayout làm layout chính */}
        <Route path="/" element={<DashboardLayout />}>
          <Route path="staff" element={<StaffTable />} />
          <Route path="applicant" element={<ApplicantsTable />} />
          <Route path="jobtitle" element={<JobTable />} />
          <Route path="department" element={<DepartmentTable />} />
        </Route>
      </Routes>
    // </Router>
  );
}

export default App;
