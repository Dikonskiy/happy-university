/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from 'react';
import Home from '../components/Home'
import Attendance from '../components/Attendance'
import '../css/profile.css'


const Layout = () => {
  const [tab, setTab] = useState('home')

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
            <button class="sidebar-btn-down" type="submit">Sign Out</button>
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