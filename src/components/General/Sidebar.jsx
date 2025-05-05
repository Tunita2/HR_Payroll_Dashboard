import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import "../../styles/GeneralStyles/Sidebar.css";

const Sidebar_Admin = ({ menuConfig, settingItems, userRole }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [openMenus, setOpenMenus] = useState({ employee: false, payroll: false });

  const handleClick = (path) => {
    setActiveItem(path);
  };

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <nav className="navbar admin-sidebar">
      <div className="logo">
        <h1>{userRole}</h1>
      </div>

      <div className="content">
        <div className="menu">
          {menuConfig.map((item) => {
            const Icon = item.icon;

            if (item.children) {
              return (
                <div className="menu-group" key={item.id}>
                  <div
                    className="menu-item submenu-toggle"
                    onClick={() => toggleMenu(item.id)}
                  >
                    <Icon className="menu-icon" />
                    <span>{item.text}</span>
                    {openMenus[item.id] ? <MdExpandLess /> : <MdExpandMore />}
                  </div>

                  {openMenus[item.id] && (
                    <div className="submenu">
                      {item.children.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className={`submenu-item ${activeItem === sub.path ? "active" : ""
                            }`}
                          onClick={() => handleClick(sub.path)}
                        >
                          {sub.text}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                to={item.path}
                key={item.id}
                className={`menu-item ${activeItem === item.path ? "active" : ""}`}
                onClick={() => handleClick(item.path)}
              >
                <Icon className="menu-icon" />
                <span>{item.text}</span>
              </Link>
            );
          })}
        </div>

        <div className="settings">
          {settingItems.map((item) => (
            <Link
              to={item.path}
              key={item.id}
              className={`menu-item ${activeItem === item.path ? "active" : ""}`}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                } else {
                  setActiveItem(item.path);
                }
              }}
            >
              <item.icon className="menu-icon" />
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar_Admin;
