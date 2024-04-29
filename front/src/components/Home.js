import React, { useEffect, useState } from "react";
import Info from "./Info";
import avatar from "../elements/stud_photo.jpg";
import { checkToken } from "./fetches";
import Layout from "../pages/Layout";

const Home = () => {
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

  return (
    <div className="layout">
      <Layout />
      <div className="main">
        <div className="top-bar">
          <header className="header">
            {role === "Student" && (
              <h2>
                Student Information
                <br />
                System
              </h2>
            )}
            {role === "Teacher" && (
              <h2>
                Teacher Information
                <br />
                System
              </h2>
            )}
            {role === "Admin" && (
              <h2>
                Admin Workspace
                <br />
                System
              </h2>
            )}
            <h2>Portal Guidlenes</h2>
          </header>
        </div>
        <div className="box">
          <div>
            <h2 className="home-h2">Home Page</h2>
          </div>

          <div className="form-row">
            <img src={avatar} width="300" height="500" className="images" alt="Profile" />
            <Info />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
