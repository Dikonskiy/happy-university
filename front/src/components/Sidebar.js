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
        <button className={`sidebar-btn ${tab === "home" ? "active" : "inactive"}`} onClick={() => highlightButton("home")}>
          Home
        </button>
        <button className={`sidebar-btn ${tab === "attendance" ? "active" : "inactive"}`} onClick={() => highlightButton("attendance")}>
          Electronic Attendance
        </button>
        {role === "Student" && (
          <button className={`sidebar-btn ${tab === "check" ? "active" : "inactive"}`} onClick={() => highlightButton("check")}>
            Autocheck
          </button>
        )}
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
