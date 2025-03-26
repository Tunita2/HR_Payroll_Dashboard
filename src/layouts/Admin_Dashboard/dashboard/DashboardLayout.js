import React from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import DashboardMetrics from "./DashboardMetrics";
import EmployeeStatistics from "./EmployeeStatistics";
import DepartmentStatistics from "./DepartmentStatistics";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const birthdays = [
    {
      name: "John Smith",
      role: "Developer",
      date: "Dec 24",
      image:
        "https://dashboard.codeparrot.ai/api/image/Z-Opw94gt92eP1YN/image.png",
    },
    {
      name: "Sarah Wilson",
      role: "Designer",
      date: "Dec 25",
      image:
        "https://dashboard.codeparrot.ai/api/image/Z-Opw94gt92eP1YN/image-2.png",
    },
    {
      name: "Mike Johnson",
      role: "Manager",
      date: "Dec 26",
      image:
        "https://dashboard.codeparrot.ai/api/image/Z-Opw94gt92eP1YN/image-3.png",
    },
  ];

  const anniversaries = [
    {
      name: "Alice Cooper",
      role: "Senior Developer",
      years: "5 years",
      image:
        "https://dashboard.codeparrot.ai/api/image/Z-Opw94gt92eP1YN/image-4.png",
    },
    {
      name: "Bob Wilson",
      role: "Product Manager",
      years: "3 years",
      image:
        "https://dashboard.codeparrot.ai/api/image/Z-Opw94gt92eP1YN/image-5.png",
    },
    {
      name: "Carol White",
      role: "Designer",
      years: "2 years",
      image:
        "https://dashboard.codeparrot.ai/api/image/Z-Opw94gt92eP1YN/image-6.png",
    },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          <DashboardMetrics />
          <div className="statistics-section">
            <EmployeeStatistics
              birthdays={birthdays}
              anniversaries={anniversaries}
            />
            {/* <DepartmentStatistics /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
