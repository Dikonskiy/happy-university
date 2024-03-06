import React from 'react';

const Registration = () => {
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  const handleAgreeToTermsChange = () => {
    setAgreeToTerms(!agreeToTerms);
  };

  return (
        <form action="#">
            <div className="input-field">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Your email" />
            </div>
            <div className="input-field">   
                <label htmlFor="fullName">Full Name:</label>
                <input type="text" id="fullName" name="fullName" placeholder="Your full name" />
            </div>  
            <div className="input-field">
                <label htmlFor="Role">Choose your role</label>
                <select className="form-select" type="role" id="role" name="role" required="">
                    <option value="">--Please choose an option--</option>
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
            {/* <div className="already-have-an-account">
                Already have an account? <a href='\login'>Log in</a>
            </div> */}
        </form>
  );
};

export default Registration;
