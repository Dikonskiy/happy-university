import React, { useState, useEffect } from 'react';
import Home from '../components/Home'
import Attendance from '../components/Attendance'
import Info from '../components/Info';
import '../css/profile.css'


const Layout = () => {
  console.log(localStorage.getItem('activeTab'))
  const [tab, setTab] = useState(localStorage.getItem('activeTab')||'home')
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

  const highlightButton = (tabName) => {
    setTab(tabName);
    localStorage.setItem('activeTab', tabName)
  };

  return (
    <div className="layout">
        <div className="sidebar">
            <div className="conteiner">
              <img src="https://cdn-icons-png.flaticon.com/512/6063/6063620.png " width="110px" height="110px" alt="Logo"/>
              <h1 className="logo">Happy University</h1>
            </div>
            <button className={`sidebar-btn ${tab === 'home' ? 'active' : 'inactive'}`} onClick={() => highlightButton('home')} >Home</button>
            <button className={`sidebar-btn ${tab === 'attendance' ? 'active' : 'inactive'}`} onClick={() => highlightButton('attendance')} >Electronic Attendance</button>
            <button className="sidebar-btn-down" type="submit" onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              // history.push('/login');
              window.location.href = '/login';
            }}>Sign Out</button>
        </div>
        <div className="main">
            <div className="top-bar">
              <header className="header">
                <h2>Student Information<br/>System</h2>
                <h2>Portal Guidlenes</h2>
              </header>
              {tab === 'attendance' && (
                  <div className="form-row">
                    <Info/>
                    <img src="https://oldmy.sdu.edu.kz/stud_photo.php?ses=e69f85cc9b0d3a6f75a2a26b292a05f3&t=63" width="140" height="180" className="images" alt="Profile"/>
                  </div>
                )}
            </div>
            {tab === 'home' && (
              <Home />
            )}

            {tab === 'attendance' && (
              <Attendance />
            )}
        </div>
    </div>
  );
};

export default Layout;