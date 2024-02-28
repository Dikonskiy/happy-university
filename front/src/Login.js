import './css/login.css';
import React, { useState, useEffect } from 'react';
import { authorization } from './components/utils';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem('accessToken');
    // TODO first refresh token after access token
    // if (localStorage.getItem('accessToken')) {
    //   if (localStorage.getItem('refreshToken')) {
    //     // TODO this is where you would refresh the access token
    //   }
    //   window.location.href = '/home';
    // }
    useEffect(() => {
      // Simulating an asynchronous operation (e.g., fetching data) that takes time
      const fetchData = async () => {
        // Replace this with your actual asynchronous operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false); // Set loading to false when the operation is complete
      };
  
      if (accessToken) {
        window.location.href = '/home';
      } else {
        fetchData();
      }
    }, [accessToken]);
  
    if (loading) {
      return (
        <div className="loader"></div>
      );
    }
  

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
      
        // Send the data to your Go back-end
        authorization(email, password)
          .then((response) => {
            // Handle successful login
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Login failed');
            }
          })
          .then((data) => {
            // Save the access token
            if (data && data.access_token) {
              
              const decodedAccessToken = jwtDecode(data.access_token);
              console.log(decodedAccessToken); 
              localStorage.setItem('accessToken', decodedAccessToken);
              

              if (data.refresh_token) {
                const decodedRefreshToken = jwtDecode(data.refresh_token);
                console.log(decodedRefreshToken);
                localStorage.setItem('refreshToken', decodedRefreshToken);
              }
              // Redirect to home page after successful login
              window.location.href = '/home';
            } else {
                console.error('Invalid token data:', data);
            }
          })
          .catch((error) => {
            // Handle error
            console.error(error);
            // Show error message to user
            alert('Login failed. Please check your email and password and try again.');
          });
      };

    return (
        <div>
            <div className="form-wrapper"> <h1>Log in</h1>
                <form onSubmit={handleSubmit} action="#">
                    <div className="input-field">
                        <label htmlFor="email">Email address:</label>
                        <input type="email" id="email" name="email" placeholder="Email address"></input>
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" placeholder="Password"></input>
                    </div>
                    <a href="/forgotpassword">Forgot password?</a>
                    <button type="submit">Log in</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
