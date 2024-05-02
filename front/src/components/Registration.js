import React, { useState } from 'react';
import { registration } from './fetches';

const Registration = () => {
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);
  const [pin, setPin] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;

    // Allow only numbers
    const onlyNums = value.replace(/[^0-9]/g, '');

    // Limit to 4 digits
    const limitedNums = onlyNums.slice(0, 4);

    setPin(limitedNums);
  };

  const handleAgreeToTermsChange = () => {
    setAgreeToTerms(!agreeToTerms);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your password reset logic here.

    const email = event.target.email.value;
    const fullName = event.target.fullName.value;
    const role = event.target.role.value;
    const password = event.target.password.value;
    const pincode = event.target.pincode.value;

    // Send the data to your Go back-end
    registration(fullName, email, role, password, pincode)
        .then((response) => {
            // Handle successful login
            if (response.ok) {
                return response;
            }
        })
        .catch((error) => {
            // Handle error
            console.error(error);
            // Show error message to user
            alert(error.message)
        });

  };

  return (
        <form onSubmit={handleSubmit} action="#">
            <div className="input-field">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Your email" />
            </div>
            <div className="input-field">   
                <label htmlFor="fullName">Full Name:</label>
                <input type="text" id="fullName" name="fullName" placeholder="Your full name" />
            </div>  
            <div className="input-field">
                <label htmlFor="Role">Choose your role:</label>
                <select className="form-select" type="role" id="role" name="role" required="" defaultValue={"none"}>
                    <option value="none" disabled hidden>--Please choose an option--</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            </div>
            <div className="input-field">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" placeholder="Your password" />
                <div className="icon"></div>
                <div className="eye"></div>
            </div>
            <div className="input-field">
                <p style={{ fontSize: '12px' }}>Please write down this pin or take a screenshot for the future</p>
                <label htmlFor="pin">Pin for password recovery:</label>
                <input
                    type="text"
                    value={pin}
                    onChange={handleChange}
                    maxLength={4}
                    placeholder="Enter 4-digit PIN"
                />
                <div className="icon"></div>
                <div className="eye"></div>
            </div>
            <div className="checkbox-container">
                <input
                type="checkbox"
                id="terms-and-privacy-policy"
                checked={agreeToTerms}
                onChange={handleAgreeToTermsChange}
                />
                <label htmlFor="terms-and-privacy-policy">
                I accept the terms and privacy policy
                </label>
            </div>
            <button type="submit" disabled={!agreeToTerms}>
                Commit
            </button>
        </form>
  );
};

export default Registration;
