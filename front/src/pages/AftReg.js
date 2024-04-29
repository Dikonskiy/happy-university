import React from 'react';
import ImageUpload from '../components/ImageUpload';

const AftReg = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your password reset logic here.

    // const email = event.target.email.value;
    // const fullName = event.target.fullName.value;
    // const role = event.target.role.value;
    // const password = event.target.password.value;

    // // Send the data to your Go back-end
    // registration(fullName, email, role, password)
    //     .then((response) => {
    //         // Handle successful login
    //         if (response.ok) {
    //             return response;
    //         }
    //     })
    //     .catch((error) => {
    //         // Handle error
    //         console.error(error);
    //         // Show error message to user
    //         alert(error.message)
    //     });

  };

  return (
    <div className="form-wrapper">
        <form onSubmit={handleSubmit} action="#">
            <div className="input-field">
                <label htmlFor="birth">Birth Date:</label>
                <input className="custom" type="date" id="birth" name="birth" placeholder="Your birth" defaultValue="2000-02-29"/>
            </div>
            <div className="input-field">   
                <label htmlFor="address">Address:</label>
                <input type="text" id="address" name="address" placeholder="Your address" />
            </div>
            <div className="input-field">
                <label htmlFor="image">Image:</label>
                <ImageUpload/>
            </div>
            <button type="submit">
                Join
            </button>
        </form>
    </div>
  );
};

export default AftReg;
