import React, { useState } from 'react';

const ForgotPasswordForm = () => {
  const [ID, setID] = useState('');

  const handleInputChange = (e) => {
    setID(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Implement your password reset logic here.
    console.log('Email:', ID);
  };

  return (
    <div className="form-wrapper">
      <h1>Forgot password?</h1>
      <p>Don't worry! It happens. Please enter the<br/> ID associated with your account.</p>
      <form onSubmit={handleFormSubmit}>
        <div className="input-field">
          <label htmlFor="email">Your Card ID:</label>
          <input
            type="number"
            id="id"
            name="id"
            value={ID}
            onChange={handleInputChange}
            placeholder="Card ID"
            required
          />
        </div> <br/><br/><br/>
        <button type="submit">Send code</button>
        <p>
            Remember password? <a href="/sign">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
