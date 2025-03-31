import React from "react";
import NavBar from "./NavBar";
import TabBar from "./TabBar";
import DashboardTitle from "./DashboardTitle";
import { Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
        background:
          "linear-gradient(97.72deg, rgba(21,14,95,1) 3.05%, rgba(20,10,88,1) 22.35%, rgba(42,27,130,1) 27.88%, rgba(182,174,206,1) 93.59%)",
      }}
    >
      <NavBar style={{ flexGrow: 0, width: "100px", height: "100vh" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          height: "100vh",
          overflow: "auto", // Cho phép cuộn nếu nội dung dài
        }}
      >
        <TabBar style={{ flexGrow: 0, width: "100%", height: "50px" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            // padding: "30px 0px 0px 0px",
            margin: "50px ",
          }}
        >
          {/* Kiểm tra nếu đường dẫn là "/staff" thì hiển thị StaffTable, ngược lại hiển thị DashboardTitle */}
          {/* {location.pathname === "/staff" ? <Outlet /> : <DashboardTitle/>} */}
          {location.pathname === "/staff" ||
          location.pathname === "/applicant" ||
          location.pathname === "/department" ||
          location.pathname === "/jobtitle" ? (
            <Outlet />
          ) : (
            <DashboardTitle />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
