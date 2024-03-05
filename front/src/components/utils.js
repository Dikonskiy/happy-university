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
