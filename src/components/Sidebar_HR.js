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

const Sidebar_HR = ({ menuItems = [] }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  menuItems =
    [{
      id: "dashboard",
      icon: GoHomeFill,
      text: "Dashboard",
      // active: true,
    //   path: "/hr-dashboard",
    },
    {
      id: "staff",
      icon: GiPayMoney,
      text: "Staff",
    //   path: "/staff"
    },
    {
      id: "department",
      icon: IoIosPeople,
      text: "Department",
    //   path: "/department"
    },
    {
        id: "job",
        icon: IoIosPeople,
        text: "Jobs",
      //   path: "/department"
      },
    {
        id: "applicant",
        icon: IoIosPeople,
        text: "Applicant",
        // path: "/applicant"
      },
    {
      id: "schedule",
      icon: GrSchedule,
      text: "Schedule",

    },
    {
      id: "report",
      icon: TbReportSearch,
      text: "Report",
    //   path: ""
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
      path: "/login",
    },
  ]
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>HR</h1>
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
          <div key={item.id} className="menu-item">
            <item.icon className="menu-icon" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar_HR;