import React, { useState } from 'react';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isFormValid = () => newPassword.length >= 8 && newPassword === confirmPassword;

  return (
    <div>
      <div className="form-wrapper">
        <h1>Reset Password</h1>
        <p>Please write something you'll remember</p>
        <form>
          <div className="input-field">
            <label htmlFor="newPassword">New password</label>
            <input
              type="password"
              id="newPassword"
              placeholder="must be 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}  
            />
          </div>
          <div className="input-field">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <br/> <br/>
          <button type="submit" disabled={!isFormValid()}>
            Reset password
          </button>
          <p>
            Already have an account? <a href="/login">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
