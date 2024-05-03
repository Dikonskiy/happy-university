import React, { useState } from 'react';
import { updatePassword } from '../components/fetches';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isFormValid = () => newPassword.length >= 8 && newPassword === confirmPassword;

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Implement your password reset logic here.
    console.log(localStorage.getItem('cardId'))
    updatePassword(localStorage.getItem('cardId'), newPassword)
      .then((response) => {
        if(response.ok){
          return response.text();
        } else {
          throw new Error('Password reset failed');
        }
      })
      .then((data) => {
        if(data){
          if (data === 'Password changed successfully'){
            window.alert('Password changed successfully')
            window.location.href = '/sign';
          }
        } else {
          console.error('Invalid data:', data);
        }
      })
      .catch((error) =>  { 
        console.error(error); 
      });
  }

  return (
    <div>
      <div className="form-wrapper">
        <h1>Reset Password</h1>
        <p>Please write something you'll remember</p>
        <form onSubmit={handleFormSubmit}>
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
            Already have an account? <a href="/sign">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
