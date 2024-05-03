import React, { useEffect, useState } from "react";
import Stopwatch from "../components/Stopwatch";
import Sidebar from "../components/Sidebar";
import { checkToken } from "../components/fetches";
import Topbar from "../components/Topbar";

const ManualAtt = () => {
  const role = localStorage.getItem("userRole");
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const refreshToken = localStorage.getItem("refreshToken");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccessToken = async () => {
      const newAccessToken = await checkToken(accessToken, refreshToken);
      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
      setLoading(false);
    };
    checkAccessToken();
  }, [accessToken, refreshToken]);

  if (loading) {
    return <div className="loader"></div>;
  }


  const handleButtonClick = (e) => {
    e.preventDefault();
  };
  return (
    <div className="layout">
        <Sidebar />
        <div className="main">
            <Topbar />
            <div className="attendance-box">
                {role === "Teacher" && <h2 className="home-h2">Start Class</h2>}
                {role === "Student" && <h2 className="home-h2">Manual Attendance</h2>}
                {role === "Admin" && <h2 className="home-h2">Work with Attendance</h2>}
                <p>Enter your code from teacher for participate to class</p>
                <div>
                    <span className="ct">Code: </span>
                    <input 
                    className="select-term" 
                    type="" id="code" 
                    name="code"
                    placeholder="Enter code here">
                    </input>
                    <input className="show-button" type="button" value="Enter" onClick={handleButtonClick}></input>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ManualAtt;
