import { IoSettings } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { GoHomeFill } from "react-icons/go";
import { GiPayMoney } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";
import { GrSchedule } from "react-icons/gr";
import { TbReportSearch } from "react-icons/tb";

export const menuConfig = [{
      id: "dashboard",
      icon: GoHomeFill,
      text: "Dashboard",
      active: true,
      path: "/payroll",
    },
    {
      id: "salaries",
      icon: GiPayMoney,
      text: "Salaries",
      path: "/payroll/salary"
    },
    {
      id: "attendance",
      icon: IoIosPeople,
      text: "Attendance",
      path: "/payroll/attendance"
    },
    {
      id: "schedule",
      icon: GrSchedule,
      text: "Schedule",
      path: "/payroll/schedule"
    },
    {
      id: "report",
      icon: TbReportSearch,
      text: "Report",
      path: "/payroll/report"
    }]

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