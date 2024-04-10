import React, { useState, useEffect } from 'react';
import Home from '../components/Home'
import Attendance from '../components/Attendance'
import Check from '../components/Check'
import Info from '../components/Info';
import { checkToken } from '../components/fetches';
import '../css/profile.css'


const Layout = () => {
  const [tab, setTab] = useState(localStorage.getItem('activeTab')||'home')
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('userRole');
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    const checkAccessToken = async () => {
      const newAccessToken = await checkToken(accessToken, refreshToken);
      setAccessToken(newAccessToken);
      localStorage.setItem('accessToken', newAccessToken);
      setLoading(false);
    }
    checkAccessToken();
  }, [accessToken, refreshToken]);

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
              <img src="https://cdn-icons-png.flaticon.com/512/6063/6063620.png " width="110" height="110" alt="Logo"/>
              <h1 className="logo">Happy University</h1>
            </div>
            <button className={`sidebar-btn ${tab === 'home' ? 'active' : 'inactive'}`} onClick={() => highlightButton('home')} >Home</button>
            <button className={`sidebar-btn ${tab === 'attendance' ? 'active' : 'inactive'}`} onClick={() => highlightButton('attendance')} >Electronic Attendance</button>
            {role === 'Student' && (
              <button className={`sidebar-btn ${tab === 'check' ? 'active' : 'inactive'}`} onClick={() => highlightButton('check')} >Autocheck</button>
            )}
            <button className="sidebar-btn-down" type="submit" onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('activeTab');
              localStorage.removeItem('userData');
              localStorage.removeItem('userRole');
              window.location.href = '/login';
            }}>Sign Out</button>
        </div>
        <div className="main">
            <div className="top-bar">
              <header className="header">
                {role === 'Student' && (
                  <h2>Student Information<br/>System</h2>
                )}
                {role === 'Teacher' && (
                  <h2>Teacher Information<br/>System</h2>
                )}
                {role === 'Admin' && (
                  <h2>Admin Workspace<br/>System</h2>
                )}
                <h2>Portal Guidlenes</h2>
              </header>
              {tab !== 'home' && (
                  <div className="profile">
                    <Info/>
                    <img src="../stud_photo.jpg" width="140" height="180" className="images" alt="Profile"/>
                  </div>
                )}
            </div>
            {tab === 'home' && (
              <Home />
            )}

            {tab === 'attendance' && (
              <Attendance />
            )}

            {role === 'Student' && tab === 'check' && (
              <Check />
            )}
        </div>
    </div>
  );
};

export default Layout;