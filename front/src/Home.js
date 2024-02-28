import React, { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';
import './css/home.css';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    // Simulating an asynchronous operation (e.g., fetching data) that takes time
    const fetchData = async () => {
      // Replace this with your actual asynchronous operation
      await new Promise(resolve => setTimeout(resolve, 1));
      setLoading(false); // Set loading to false when the operation is complete
    };

    if (!accessToken) {
      window.location.href = '/login';
    } else {
      fetchData();
    }
  }, [accessToken]);

  if (loading) {
    return (
      <div className="loader"></div>
    );
  }

  return (
    <div className="Home">
      <header className="Home-header">
        <h1>Happy University</h1>
      </header>
      <div className="Home-body">
        <div className="Home-attendance">
          <h2>Electronic Attendance</h2>
          <button className="Home-signout" onClick={() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            // history.push('/login');
            window.location.href = '/login';
          }}>Sign Out</button>
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