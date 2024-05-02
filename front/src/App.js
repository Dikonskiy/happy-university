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
import Home from './pages/Home.js';
import Attendance from './pages/Attendance.js';
import Check from './pages/Check.js';
import Test from './pages/Test.js';


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
          <Route exact path='/test' component={Test} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;