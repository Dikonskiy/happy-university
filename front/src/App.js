import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './css/App.css';
import Login from './Login.js'; 
import ForgotPasswordForm from './ForgotPasswordForm.js';
import ResetPassword from './ResetPassword.js';
import Home from './Home.js';


const App = () => {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/forgotpassword' component={ForgotPasswordForm} />
          <Route exact path='/resetpassword' component={ResetPassword} />
          <Route exact path='/home' component={Home} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
