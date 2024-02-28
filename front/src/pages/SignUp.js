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

  useEffect(() => {
    // После монтирования компонента устанавливаем кнопку "Sign up" как активную
    document.querySelector('.button-box button:first-child').classList.add('active');
  }, []); 

  const highlightButton = (tabName, event) => {
    setTab(tabName);
    const buttons = document.querySelectorAll('.button-box button');  
    buttons.forEach((btn) => {
      btn.classList.remove('active');
    });
    // Добавляем класс active к нажатой кнопке
    event.target.classList.add('active');
  };
    
  
  return (
    <div className="form-wrapper">
      <h1>Happy</h1>
      <form action="#"> 
        <div className="input-field">
          <div className="button-box">
            <button isActive={tab==='login'} onClick={(e) => highlightButton('login', e)}>Sign up</button>
            <button isActive={tab==='register'} onClick={(e) => highlightButton('register', e)}>Register</button>
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
      </form>
    </div>
  );
};

export default SignUp;
