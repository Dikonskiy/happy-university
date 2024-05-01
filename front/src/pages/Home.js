import React, { useEffect, useState } from "react";
import Info from "../components/Info";
import avatar from "../elements/stud_photo.jpg";
import { checkToken } from "../components/fetches";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Home = () => {
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
      <Sidebar />
      <div className="main">
      <Topbar />
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
