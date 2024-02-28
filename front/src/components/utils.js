import { encode } from 'js-base64';

// utils.js
export const authorization = (email, password) => {
  const data = {
    email: email,
    password: password
  };
  let headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Authorization', 'Basic ' + encode(email + ":" +  password));
  headers.append('Origin','http://localhost:3000');

    return fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
};
