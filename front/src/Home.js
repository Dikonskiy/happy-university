import React from 'react';
import './css/home.css';

const Home = () => {
  return (
    <div className="Home">
      <header className="Home-header">
        <h1>Happy University</h1>
      </header>
      <div className="Home-body">
        <div className="Home-attendance">
          <h2>Electronic Attendance</h2>
          <button className="Home-signout">Sign Out</button>
        </div>
        <div className="Home-studentinfo">
          <h2>Student Information</h2>
          <div className="Home-studentinfo-details">
            <p>Name Surname: German Lee</p>
            <p>ID: 24010487</p>
            <p>Email: germanlee@happy.edu.kz</p>
          </div>
        </div>
      </div>
      <footer className="Home-footer">  
        <p>System Portal Guideline</p>
      </footer>
    </div>
  );
};

export default Home;