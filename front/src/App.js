import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './css/App.css';
import './css/public.css'
import './css/login.css'
import SignUp from './pages/SignUp.js';
import AftReg from './pages/AftReg.js';
import ForgotPasswordForm from './pages/ForgotPasswordForm.js';
import SendCode from './pages/SendCode.js';
import ResetPassword from './pages/ResetPassword.js';
import Layout from './pages/Layout.js';
import Home from './components/Home.js';
import Attendance from './components/Attendance.js';
import Check from './components/Check.js';


const App = () => {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/sign' component={SignUp} />
          <Route exact path='/sign/forgotpassword' component={ForgotPasswordForm} />
          <Route exact path='/sign/forgotpassword/sendcode' component={SendCode} />
          <Route exact path='/sign/forgotpassword/sendcode/resetpassword' component={ResetPassword} />
          <Route exact path='/sign/aftereg' component={AftReg} />
          <Route exact path='/home' component={Home} />
          <Route exact path='/attendance' component={Attendance} />
          <Route exact path='/check' component={Check} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;