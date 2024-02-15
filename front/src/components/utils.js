import { jwtDecode } from 'jwt-decode';
import { encode } from 'js-base64';

// utils.js
export const sendDataToBackend = (email, password) => {
  const data = {
    email: email,
    password: password
  };
  let headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Authorization', 'Basic ' + encode(email + ":" +  password));
  headers.append('Origin','http://localhost:3000');

    fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          // console.log(response.json())
          return response.json();
        }
        return Promise.reject(new Error('Login failed'));
      })
      .then((data) => {
        // Handle successful login
        if (data && data.access_token) {
          try {
            const decodedToken = jwtDecode(data.access_token);
            console.log('Login successful:', decodedToken);
          } catch (decodeError) {
            console.error('Error decoding token:', decodeError);
          }
        } else {
          console.error('Invalid token data:', data);
        }
      })
      .catch((error) => {
        // Handle error
        console.error('', error);
      });
};
