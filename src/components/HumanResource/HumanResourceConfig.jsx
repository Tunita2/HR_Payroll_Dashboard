import { IoSettings } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { GoHomeFill } from "react-icons/go";
import { GiPayMoney } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";
import { GrSchedule } from "react-icons/gr";
import { TbReportSearch } from "react-icons/tb"; 

 export const menuConfig = [
    {
      id: "dashboard",
      icon: GoHomeFill,
      text: "Dashboard",
      active: true,
      path: "/human-resource",
    },
    {
      id: "applicant",
      icon: GiPayMoney,
      text: "Applicant",
      path: "/human-resource/applicant"
    },
    {
      id: "staff",
      icon: IoIosPeople,
      text: "Staff",
      path: "/human-resource/staff",
    },
    {
      id: "jobTitle",
      icon: GrSchedule,
      text: "Job Title",
      path: "/human-resource/jobtitle",
    },
    {
      id: "department",
      icon: TbReportSearch,
      text: "Department",
      path: "/human-resource/department",
    },
    {
      id: "report",
      icon: TbReportSearch,
      text: "Report",
      path: "/human-resource/report"
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