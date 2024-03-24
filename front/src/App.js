import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './css/App.css';
import './css/public.css'
import './css/login.css'
import SignUp from './pages/SignUp.js';
import ForgotPasswordForm from './pages/ForgotPasswordForm.js';
import SendCode from './pages/SendCode.js';
import ResetPassword from './pages/ResetPassword.js';
import Layout from './pages/Layout.js';


const App = () => {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Layout} />
          <Route exact path='/login' component={SignUp} />
          <Route exact path='/forgotpassword' component={ForgotPasswordForm} />
          <Route exact path='/sendcode' component={SendCode} />
          <Route exact path='/resetpassword' component={ResetPassword} />
          <Route exact path='/home' component={Layout} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;