import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login.js';
import ResetPassword from './ResetPassword.js';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route exact path='/resetpassword' component={ResetPassword} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
