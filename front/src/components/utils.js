import { encode } from 'js-base64';
import { jwtDecode } from 'jwt-decode';

const JWT_EXP_BUFFER_MINUTES = 5; // Set the buffer time in minutes before the token expires

// utils.js

export const checkToken = async (accessToken, refreshToken) => {
  // console.log(accessToken);
  const data = {
    refresh_token: refreshToken
  };
  
  if (typeof accessToken !== 'string' || accessToken === 'undefined') {
    localStorage.clear();
    window.location.href = '/login';
  }

  const decodedAccessToken = jwtDecode(accessToken)
  const jwtExpirationTime = decodedAccessToken.exp * 1000; // Convert the expiration time to milliseconds
  const currentTime = Date.now();

  if (jwtExpirationTime - currentTime > JWT_EXP_BUFFER_MINUTES * 60 * 1000) {
    console.log('Access token is valid'); // TODO change to logger
    return accessToken;
  }

  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');
  try{
    const response = await fetch('http://localhost:8080/access-token', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const data = await response.json();
      if (data && data.access_token){
        return data.access_token;
      } else {
        throw new Error("Invalid data");
      }
    } 
    else if (response.statusCode === 401){
      localStorage.clear();
      window.location.href = '/login';
    } 
    else {
      throw new Error("Failed to refresh access token");
    }
  } catch (error){
    console.error(error);
    return accessToken;
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

export const takeUserData = (cardId) => {
  const data = {
    card_id: cardId
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');
  headers.append('Authorization', 'Bearer' + localStorage.getItem('accessToken'))

  return fetch('http://localhost:8080/get-user-data', {
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