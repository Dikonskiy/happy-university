import React from "react";
import Info from "../components/Info";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Avatar from "../components/Avatar";

const Home = () => {
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
