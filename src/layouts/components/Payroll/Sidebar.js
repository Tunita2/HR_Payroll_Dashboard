import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = () => {
  const [active, setActive] = useState("View Payroll");

  const menuItems = [
    { name: "Payroll management" },
    { name: "View Payroll" },
    { name: "Salary History" },
    { name: "Attendance management" },
    { name: "Payroll Report" },
    { name: "Alert" },
  ];

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">
        Payroll <span>Dashboard</span>
      </h2>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={active === item.name ? "active" : ""}
            onClick={() => setActive(item.name)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
