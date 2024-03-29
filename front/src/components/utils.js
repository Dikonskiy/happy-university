import { encode } from 'js-base64';
import { jwtDecode } from 'jwt-decode';

const JWT_EXP_BUFFER_MINUTES = 5; // Set the buffer time in minutes before the token expires

// utils.js

export const checkToken = (accessToken, refreshToken) => {
  const data = {
    refresh_token: refreshToken
  };
  // console.log(accessToken);
  if (typeof accessToken === 'string' && accessToken !== 'undefined') {
    const decodedAccessToken = jwtDecode(accessToken)
    const jwtExpirationTime = decodedAccessToken.exp * 1000; // Convert the expiration time to milliseconds
    const currentTime = Date.now();
    // console.log(jwtExpirationTime - currentTime)
    // console.log(JWT_EXP_BUFFER_MINUTES * 60 * 1000)
    if (jwtExpirationTime - currentTime < JWT_EXP_BUFFER_MINUTES * 60 * 1000) {
      let newAccessToken;
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Origin','http://localhost:3000');
      newAccessToken = fetch('http://localhost:8080/access-token', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
        .then((response) => { 
          if (response.ok) {
            return response.json();
          } 
          else if (response.statusCode === 401){
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('activeTab');
            localStorage.removeItem('userData');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
          } 
          else {
            throw new Error("Failed to refresh access token");
          }
        })
        .then((data) => {
          if (data && data.access_token){
            return data.access_token;
          } else {
            throw new Error('Invalid data: ', data);
          }
        })
        .catch((error) => {
          console.error(error);
          return accessToken;
        });
      return newAccessToken.json();
    } else {
      console.log('Access token is valid'); // TODO change to logger
      return accessToken;
    }
  } 
  else{
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('activeTab');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
    return null;
  }
  
}

export const authorization = (id, password) => {
  const data = {
    card_id: id,
    password: password
  };
  let headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Authorization', 'Basic ' + encode(id + ":" +  password));
  headers.append('Origin','http://localhost:3000');

  return fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
};

export const registration = (name, email, role, password) => {
  const data = {
    name: name,
    email: email,
    role: role,
    password: password
  };
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');

  return fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
}

export const takeUserData = (accessToken, refreshToken) => {
  const data = {
    access_token: accessToken,
    refresh_token: refreshToken
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');
  headers.append('Authorization', 'Bearer ' + accessToken)

  return fetch('http://localhost:8080/user', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const getRole = (accessToken) => {
  const data = {
    access_token: accessToken
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');
  headers.append('Authorization', 'Bearer'+ accessToken)

  return fetch('http://localhost:8080/get-role', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const takeAttendanceDataForStudent = (term) => {
  const data = {
    term: term
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');
  headers.append('Authorization', 'Bearer'+ localStorage.getItem('accessToken'))

  return fetch('http://localhost:8080/attendance', {
    method: 'GET',
    headers: headers,
    body: JSON.stringify(data),
  })
}