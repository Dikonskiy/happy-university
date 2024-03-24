import React, { useState } from 'react';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Implement your password reset logic here.
    console.log('Email:', email);
  };

  return (
    <div className="form-wrapper">
      <h1>Forgot password?</h1>
      <p>Don't worry! It happens. Please enter the<br/> email associated with your account.</p>
      <form onSubmit={handleFormSubmit}>
        <div className="input-field">
          <label htmlFor="email">Email address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Email address"
            required
          />
        </div> <br/><br/><br/>
        <button type="submit">Send code</button>
        <p>
            Remember password? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
