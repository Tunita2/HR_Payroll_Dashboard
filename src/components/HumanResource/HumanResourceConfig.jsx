import { IoSettings } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { GoHomeFill } from "react-icons/go";
import { GiPayMoney } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";
import { TbReportSearch } from "react-icons/tb";
import { FaAddressCard } from "react-icons/fa";
import { FaBriefcase } from "react-icons/fa";

export const menuConfig = [
  {
    id: "dashboard",
    icon: GoHomeFill,
    text: "Dashboard",
    active: true,
    path: "/human",
  },
  {
    id: "employee",
    icon: FaAddressCard,
    text: "Employee",
    path: "/human/employee",
  },
  {
    id: "dividend",
    icon: GiPayMoney,
    text: "Dividend",
    path: "/human/dividend",
  },
  {
    id: "position",
    icon: FaBriefcase,
    text: "Position",
    path: "/human/position",
  },
  {
    id: "department",
    icon: IoIosPeople,
    text: "Department",
    path: "/human/department",
  },
  {
    id: "report",
    icon: TbReportSearch,
    text: "Report",
    path: "/human/report",
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
