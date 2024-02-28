/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
import Home from '../components/Home'
import Attendance from '../components/Attendance'
import '../css/profile.css'


const Layout = () => {
  const [tab, setTab] = useState('home')
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

  const highlightButton = (tabName, event) => {
    setTab(tabName);
    event.target.classList.add('active');
  };

  return (
    <div class="layout">
        <div class="sidebar">
            <div class="conteiner">
              <img src="https://cdn-icons-png.flaticon.com/512/6063/6063620.png " width="40%"  class="img-fluid rounded" alt="Logo"/>
              <h1 class="logo">Happy University</h1>
            </div>
            <button isActive={tab==='home'} onClick={(e) => highlightButton('home', e)} class="sidebar-btn">Home</button>
            <button isActive={tab==='attendance'} onClick={(e) => highlightButton('attendance', e)} class="sidebar-btn">Electronic Attendance</button>
            <button class="sidebar-btn-down" type="submit" onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              // history.push('/login');
              window.location.href = '/login';
            }}>Sign Out</button>
        </div>
        <div class="main">
            <header class="header">
              <h2>Student Information<br/>System</h2>
              <h2>Portal Guidlenes</h2>
            </header>
            {tab === 'home' && (
              <>
              <Home />
              </>
            )}

            {tab === 'attendance' && (
              <>
              <Attendance />
              </>
            )}
        </div>
    </div>
  );
};

export default Layout;