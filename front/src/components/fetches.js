import { encode } from 'js-base64';
import { jwtDecode } from 'jwt-decode';

const JWT_EXP_BUFFER_MINUTES = 5; // buffer time in minutes before the token expires

// utils.js

export const checkToken = async (accessToken, refreshToken) => {
  const data = {
    refresh_token: refreshToken
  };
  
  if (typeof accessToken !== 'string' || accessToken === 'undefined') {
    localStorage.clear();
    window.location.href = '/sign';
  }

  const decodedAccessToken = jwtDecode(accessToken)
  const jwtExpirationTime = decodedAccessToken.exp * 1000; // Convert the expiration time to milliseconds
  const currentTime = Date.now();

  if (jwtExpirationTime - currentTime > JWT_EXP_BUFFER_MINUTES * 60 * 1000) {
    return accessToken;
  }

  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');
  try{
    const response = await fetch('http://localhost:8080/refresh-token', {
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
      window.location.href = '/sign';
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

export const registration = (name, email, role, password, pincode) => {
  const data = {
    name: name,
    email: email,
    role: role,
    password: password,
    pin_code: pincode
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

export const afterRegistration = (card_id, birth_date, image) => {
  const data = {
    card_id: card_id,
    birthday: birth_date,
    image: image
  };
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');

  return fetch('http://localhost:8080/after-reg', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const getImage = (card_id) => {
  const data = {
    card_id: card_id
  };

  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');

  return fetch('http://localhost:8080/get-image', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const getBirthDate = (card_id) => {
  const data = {
    card_id: card_id
  };

  let headers = new Headers();
  headers.append('Content-Type', 'application/json'); 
  headers.append('Accept', 'application/json'); 
  headers.append('Origin','http://localhost:3000'); 
  
  return fetch('http://localhost:8080/get-birthday', { 
    method: 'POST', 
    headers: headers, 
    body: JSON.stringify(data), 
  })  
}

export const checkPinCode = (card_id, password) => {
  const data = {
    card_id: card_id,
    password: password
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');

  return fetch('http://localhost:8080/check-pincode', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const updatePassword = (card_id, new_password) => {
  const data = {
    card_id: card_id,
    password: new_password
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');

  return fetch('http://localhost:8080/update-password', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const takeUserData = () => {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://localhost:3000');
  headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
  headers.append('Authorization', 'Bearer' + localStorage.getItem('accessToken'))

  return fetch('http://localhost:8080/get-user-data', {
    method: 'GET',
    headers: headers,
  })
}

// export const getRole = (accessToken) => {
//   const data = {
//     access_token: accessToken
//   }
//   let headers = new Headers();
//   headers.append('Content-Type', 'application/json');
//   headers.append('Accept', 'application/json');
//   headers.append('Origin','http://localhost:3000');
//   headers.append('Authorization', 'Bearer'+ accessToken)

//   return fetch('http://localhost:8080/get-role', {
//     method: 'POST',
//     headers: headers,
//     body: JSON.stringify(data),
//   })
// }

export const getCoursesStudent = (term) => {
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