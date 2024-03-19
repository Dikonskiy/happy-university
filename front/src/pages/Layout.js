import React, { useState, useEffect } from 'react';
import Home from '../components/Home'
import Attendance from '../components/Attendance'
import Info from '../components/Info';
import { getRole, takeUserData } from '../components/utils';
import '../css/profile.css'
import { Person } from '../components/Models';


const Layout = () => {
  const [tab, setTab] = useState(localStorage.getItem('activeTab')||'home')
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  // const userRole = localStorage.getItem('userRole');

  // getRole(accessToken)
  //   .then((response) => {
  //     if (response.ok) {
  //       return response.json();
  //     } else {
  //       throw new Error("Server error");
  //     }
  //   })
  //   .then((data) => {
  //     if (data && data.role) {
  //       console.log(data)
  //       // localStorage.setItem('userRole', data.role);
  //     } else {
  //       throw new Error('Invalid user data: ', data);
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });


  // takeUserData(accessToken, refreshToken)
  //   .then((response) => {
  //     if (response.ok) {
  //       return response.json();
  //     } else {
  //       throw new Error('Token check failed');
  //     }
  //   })
  //   .then((userData) => {
  //     if (userData && userData.userName && userData.userId && userData.userEmail) {
  //       const userFullName = userData.userFullName;
  //       const userId = userData.userId;
  //       const userEmail = userData.userEmail;
  //       const user = new Person(userFullName, userId, userEmail);
  //       localStorage.setItem('userData', JSON.stringify(user)); // ! for Arman => tut userData
  //     } else{
  //       throw new Error('Invalid user data: ', userData);
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });

  useEffect(() => {
    // Simulating an asynchronous operation (e.g., fetching data) that takes time
    const fetchData = async () => {
      // Replace this with your actual asynchronous operation
      await new Promise(resolve => setTimeout(resolve, 1));
      setLoading(false); // Set loading to false when the operation is complete
    };
    // console.log('test1:', isValid)
    if (accessToken) { // change this 
      // console.log('suuuuuuuuuuck')
      fetchData();
    } else {
      window.location.href = '/login';
    }
  }, [accessToken]); // and these 

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
                    <img src="https://oldmy.sdu.edu.kz/stud_photo.php?ses=c7c4d9bdd29e6e5e579c4056a5ef2d67&t=74" width="140" height="180" className="images" alt="Profile"/>
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