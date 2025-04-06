import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { IoSettings } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { GoHomeFill } from "react-icons/go";
import { GiPayMoney } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";
import { GrSchedule } from "react-icons/gr";
import { TbReportSearch } from "react-icons/tb";
import '../styles/Sidebar.css';

const Sidebar_Admin = ({ menuItems = [] }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  menuItems =
    [{
      id: "dashboard",
      icon: GoHomeFill,
      text: "Dashboard",
      // active: true,
      path: "/payroll-dashboard",
    },
    {
      id: "salaries",
      icon: GiPayMoney,
      text: "Salaries",
      path: "/payroll-management"
    },
    {
      id: "attendance",
      icon: IoIosPeople,
      text: "Attendance",
      path: "/admin/attendance-management"
    },
    {
      id: "schedule",
      icon: GrSchedule,
      text: "Schedule",

    },
    {
      id: "report",
      icon: TbReportSearch,
      text: "Salaries",
      path: "/admin/employee-management"
    }]
  const settingItems = [
    {
      id: "setting",
      icon: IoSettings,
      text: "Setting",
    },
    {
      id: "logout",
      icon: RiLogoutBoxLine,
      text: "Log out",
      path: "/",
    },
  ]
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>Admin</h1>
      </div>

      <div className="menu">
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.id}
            className={`menu-item ${activeItem === item.path ? "active" : ""}`}
            onClick={() => setActiveItem(item.path)}
          >
            <item.icon className="menu-icon" />
            <span>{item.text}</span>
          </Link>
        ))}
      </div>

      <div className="settings">
        {settingItems.map((item) => (
          <Link
            to={item.path}
            key={item.id}
            className={`menu-item ${activeItem === item.path ? "active" : ""}`}
            onClick={() => setActiveItem(item.path)}
          >
            <item.icon className="menu-icon" />
            <span>{item.text}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar_Admin;