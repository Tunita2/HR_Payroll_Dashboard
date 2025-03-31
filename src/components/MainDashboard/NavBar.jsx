import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/MainDashboard/NavBar.css";


const NavBar = ({ style = {} }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const menuItems = [
    {
      id: "dashboard",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-PATt4gt92eP1ZG/vector.png",
      text: "Dashboard",
      active: true,
      path: "/",
    },
    {
      id: "message",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-PATt4gt92eP1ZG/group.png",
      text: "Message",
    },
    {
      id: "applicant",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-PATt4gt92eP1ZG/human-re.png",
      text: "Applicant",
      path: "applicant"
    },
    {
      id: "staff",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-PATt4gt92eP1ZG/name-tag.png",
      text: "Staff",
      path: "staff",
    },
    {
      id: "jobTitle",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-oS43n5m-GBkPGI/business.png",
      text: "Job Title",
      path: "jobtitle",
    },
    {
      id: "department",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-PATt4gt92eP1ZG/people.png",
      text: "Department",
      path: "department",
    },
    {
      id: "report",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-PATt4gt92eP1ZG/document.png",
      text: "Report",
      path: "report"
    },
  ];

  const settingItems = [
    {
      id: "account",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-PATt4gt92eP1ZG/vector-2.png",
      text: "Account",
    },
    {
      id: "setting",
      icon: "https://dashboard.codeparrot.ai/api/image/Z-PATt4gt92eP1ZG/vector-3.png",
      text: "Setting",
    },
  ];

  return (
    <nav className="navbar" style={style}>
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
          <img src={item.icon} alt={item.text} className="menu-icon" />
          <span>{item.text}</span>
        </Link>
        ))}
      </div>

      <div className="settings">
        {settingItems.map((item) => (
          <div key={item.id} className="menu-item">
            <img src={item.icon} alt={item.text} className="menu-icon" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
