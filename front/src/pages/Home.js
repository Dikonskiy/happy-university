import React, { useEffect, useState } from "react";
import Info from "../components/Info";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Avatar from "../components/Avatar";
import { checkToken } from "../components/fetches";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const refreshToken = localStorage.getItem('refreshToken');
  useEffect(() => {
    const checkAccessToken = async () => {
      const newAccessToken = await checkToken(accessToken, refreshToken);
      setAccessToken(newAccessToken, newAccessToken)
      localStorage.setItem('accessToken', newAccessToken);
    }

    if (accessToken && typeof accessToken === "string" && accessToken !== "undefined") {
      checkAccessToken();
      setLoading(false)
    }else{
      window.location.href = "/sign";
    }
  }, [accessToken, refreshToken])
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
            <Avatar width={300} height={500}/>
            <Info />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
