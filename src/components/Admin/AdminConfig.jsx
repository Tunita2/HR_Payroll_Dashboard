import { GoHomeFill } from "react-icons/go";
import { IoIosPeople } from "react-icons/io";
import { GiPayMoney } from "react-icons/gi";
import { TbReportSearch } from "react-icons/tb";
import { RiAlertLine } from "react-icons/ri";


import { IoSettings } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";

export const menuConfig = [
  {
    id: "dashboard",
    icon: GoHomeFill,
    text: "Dashboard",
    active: true,
    path: "/admin",
  },
  {
    id: "employee",
    icon: IoIosPeople,
    text: "Employee",
    children: [
      { text: "Employees", path: "/admin/employees" },
      { text: "Dividends", path: "/admin/dividends" },
      { text: "Departments", path: "/admin/departments" },
      { text: "Positions", path: "/admin/positions" },
    ],
  },
  {
    id: "payroll",
    icon: GiPayMoney,
    text: "Payroll",
    children: [
      { text: "Salaries", path: "/admin/salaries" },
      { text: "Attendances", path: "/admin/attendances" },
    ],
  },
  {
    id: "report",
    icon: TbReportSearch,
    text: "Reports",
    path: "/admin/reports",
  },
  {
    id: "alerts",
    icon: RiAlertLine,
    text: "Alerts & Notifications",
    path: "/admin/alerts-and-notifications",
  },
];

export const settingItems = [
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
  ];

