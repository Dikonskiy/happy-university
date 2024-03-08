import { encode } from 'js-base64';

// utils.js
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

export const checkTokens = (accessToken, refreshToken) => {
  const data = {
    access_token: accessToken,
    refresh_token: refreshToken
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');

  return fetch('http://localhost:8080/check-tokens', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

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

  return fetch('http://localhost:8080/user', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}