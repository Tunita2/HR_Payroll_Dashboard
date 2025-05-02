import { CgProfile } from "react-icons/cg";
import { MdOutlineAttachMoney } from "react-icons/md";
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
    }
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

