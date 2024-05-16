import React, { useState } from "react";
import "../css/profile.css";

const Sidebar = () => {
  const [tab, setTab] = useState(window.location.pathname.split("/")[1]);

  const highlightButton = (tabName) => {
    setTab(tabName);
    window.location.href = "/" + tabName;
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <a className="conteiner" href="/home">
          <img src="https://cdn-icons-png.flaticon.com/512/6063/6063620.png " width="110" height="110" alt="Logo" />
          <h1 style={{ color: "black" }} className="logo">
            Happy University
          </h1>
        </a>
        <button className={`sidebar-btn ${tab === "home" ? "active" : "inactive"}`} onClick={() => highlightButton("home")} style={{ backgroundColor: tab === "home" ? "gray" : "white" }}>
          Home
        </button>
        <button className={`sidebar-btn ${tab === "attendance" ? "active" : "inactive"}`} onClick={() => highlightButton("attendance")} style={{ backgroundColor: tab === "attendance" ? "gray" : "white" }}>
          Electronic Attendance
        </button>
        <button className={`sidebar-btn ${tab === "manual" ? "active" : "inactive"}`} onClick={() => highlightButton("manual")} style={{ backgroundColor: tab === "manual" ? "gray" : "white" }}>
          Manual Attendance
        </button>

        <button
          className="sidebar-btn-down"
          type="submit"
          onClick={() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("activeTab");
            localStorage.removeItem("userData");
            localStorage.removeItem("userRole");
            window.location.href = "/sign";
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
