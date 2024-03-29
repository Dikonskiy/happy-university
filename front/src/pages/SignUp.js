import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Registration from '../components/Registration';
import { checkToken } from '../components/utils';
import '../css/login.css'

const SignUp = () => {
  const [tab, setTab] = useState(localStorage.getItem('tabActive')||'login')
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem('accessToken'); 
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    // Simulating an asynchronous operation (e.g., fetching data) that takes time
    const fetchData = async () => {
      console.log(accessToken)
      // const newAccessToken = checkToken(accessToken, refreshToken);
      if (accessToken && accessToken !== 'undefined') {
        window.location.href = '/home';
      }

      setLoading(false);
    };
    fetchData();
  }, []); // and there

  const highlightButton = (tabName) => {
    setTab(tabName);
    localStorage.setItem('tabActive', tabName);
  };
    
  if (loading) {
    return (
      <div className="loader"></div>
    );
  }else {
    return (
      <div className="form-wrapper">
        <h1>Happy</h1>
          <div className="input-field">
            <div className="button-box">
              <button className={tab === 'login' ? 'active' : 'inactive'} onClick={() => highlightButton('login')}>Sign up</button>
              <button className={tab === 'register' ? 'active' : 'inactive'} onClick={() => highlightButton('register')}>Register</button>
            </div>

            {tab === 'login' && (
              <Login />
            )}

            {tab === 'register' && (
              <Registration />
            )}
          </div>
      </div>
    );
  }
};

export default SignUp;
