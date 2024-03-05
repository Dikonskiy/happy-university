import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Registration from '../components/Registration';
import '../css/login.css'
// import { styled } from 'styled-components'
// const ButtonBox = styled.div`
// display: inline-block;
// border-radius: 10px;
// background: #EDEEEF;
// width: 353px;
// position: relative;
// `

const SignUp = () => {
  const [tab, setTab] = useState('login')
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    // Simulating an asynchronous operation (e.g., fetching data) that takes time
    const fetchData = async () => {
      // Replace this with your actual asynchronous operation
      await new Promise(resolve => setTimeout(resolve, 1));
      setLoading(false); // Set loading to false when the operation is complete
    };

    if (accessToken) {
      window.location.href = '/home';
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
  };
    
  
  return (
    <div className="form-wrapper">
      <h1>Happy</h1>
        <div className="input-field">
          <div className="button-box">
            <button className={tab === 'login' ? 'active' : 'inactive'} onClick={() => highlightButton('login')}>Sign up</button>
            <button className={tab === 'register' ? 'active' : 'inactive'} onClick={() => highlightButton('register')}>Register</button>
          </div>

          {tab === 'login' && (
            <>
            <Login />
            </>
          )}

          {tab === 'register' && (
            <>
            <Registration />
            </>
          )}
        </div>
    </div>
  );
};

export default SignUp;
