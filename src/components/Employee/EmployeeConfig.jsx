import { CgProfile } from "react-icons/cg";
import { MdOutlineAttachMoney } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { FaBell } from "react-icons/fa";

import { IoSettings } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";

export const menuConfig = [
    {
        id: "myprofile",
        icon: CgProfile,
        text: "My Profile",
        active: true,
        path: "/employee/profile",
    },
    {
        id: "payroll",
        icon: MdOutlineAttachMoney,
        text: "My Payroll",
        path: "/employee/my-payroll"
    },
    {
        id: "leave-work",
        icon: RiCalendarScheduleLine,
        text: "Leave Days / Work Status",
        path: "/employee/leave-work"
    },
    {
        id: "notifications",
        icon: FaBell,
        text: "Notifications",
        path: "/employee/notifications",
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

