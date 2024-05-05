import React, { useState } from "react";
import "../css/profile.css";

const Sidebar = () => {
  const [tab, setTab] = useState(localStorage.getItem("activeTab") || "home");
  const role = localStorage.getItem("userRole");

  const highlightButton = (tabName) => {
    setTab(tabName);
    localStorage.setItem("activeTab", tabName);
    window.location.href = "/" + tabName;
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="conteiner">
          <img src="https://cdn-icons-png.flaticon.com/512/6063/6063620.png " width="110" height="110" alt="Logo" />
          <h1 className="logo">Happy University</h1>
        </div>
        <button className={`sidebar-btn ${tab === "home" ? "active" : "inactive"}`} onClick={() => highlightButton("home")} style={{ backgroundColor: tab === "home" ? "gray" : "white" }}>
          Home
        </button>
        <button className={`sidebar-btn ${tab === "attendance" ? "active" : "inactive"}`} onClick={() => highlightButton("attendance")} style={{ backgroundColor: tab === "attendance" ? "gray" : "white" }}>
          Electronic Attendance
        </button>
        <button className={`sidebar-btn ${tab === "manual" ? "active" : "inactive"}`} onClick={() => highlightButton("manual")} style={{ backgroundColor: tab === "manual" ? "gray" : "white" }}>
          Manual Attendance
        </button>
        {role !== "Teacher" && 
        (<button className={`sidebar-btn ${tab === "check" ? "active" : "inactive"}`} onClick={() => highlightButton("check")} style={{ backgroundColor: tab === "check" ? "gray" : "white" }}>
          Autocheck
        </button>)}
        
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
