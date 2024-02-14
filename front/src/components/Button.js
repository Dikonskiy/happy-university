// Button.js
export const sendDataToBackend = (email, password) => {
    fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Login failed');
      })
      .then((data) => {
        // Handle successful login
        console.log('Login successful:', data);
      })
      .catch((error) => {
        // Handle error
        console.error('Error:', error);
      });
};