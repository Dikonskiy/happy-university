import React, { useState } from 'react';
import { checkPinCode } from '../components/fetches';

const ForgotPasswordForm = () => {
  const [ID, setID] = useState('');
  const [pin, setPin] = useState('');

  const handleChangePin = (e) => {
    const value = e.target.value;

    // Allow only numbers
    const onlyNums = value.replace(/[^0-9]/g, '');

    // Limit to 4 digits
    const limitedNums = onlyNums.slice(0, 4);

    setPin(limitedNums);
  };


  const handleChangeID = (e) => {
    const value = e.target.value;

    // Allow only numbers
    const onlyNums = value.replace(/[^0-9]/g, '');

    // Limit to 8 digits
    const limitedNums = onlyNums.slice(0, 8);

    setID(limitedNums);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Implement your password reset logic here.
    checkPinCode(ID, pin)
      .then((response) => {
        console.log(response)
        if(response.ok){
          return response.json();
        } else {
          throw new Error('Invalid pin code');
        }
      })
      .then((data) => {
        console.log(data)
        if(data && data.correct){
          localStorage.setItem('userId', ID);
          window.location.href = '/sign/forgotpassword/resetpassword';
        } else {
          console.error('Invalid data:', data);
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  }

  return (
    <div className="form-wrapper">
      <h1>Forgot password?</h1>
      <p>Don't worry! It happens. Please enter the<br/> ID associated with your account.</p>
      <form onSubmit={handleFormSubmit}>
        <div className="input-field">
          <label htmlFor="card_id">Card Id:</label>
          <input type="card_id" id="card_id" name="card_id" placeholder="ID" value={ID} onChange={handleChangeID}></input>
        </div> 
        <div className="input-field">
                <p style={{ fontSize: '12px', color: 'red'}}>Please write down your pincode that you saved in after registration page</p>
                <label htmlFor="pin">Pin for password recovery:</label>
                <input
                    type="text"
                    value={pin}
                    onChange={handleChangePin}
                    maxLength={4}
                    placeholder="Enter 4-digit PIN"
                />
            </div>
        <br/><br/><br/>
        <button type="submit">Send code</button>
        <p>
            Remember password? <a href="/sign">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
