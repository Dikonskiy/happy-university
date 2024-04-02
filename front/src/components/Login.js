import { authorization } from "./utils";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  //handle submit from Login form
  const handleSubmit = (e) => {
    //stay page dont refresh
    e.preventDefault();

    const id = e.target.card_id.value;
    const password = e.target.password.value;

    // Send the data to your Go back-end
    authorization(id, password)
      .then((response) => {
        // Handle successful login
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        // Save the tokens
        if (data && data.access_token && data.refresh_token) {
          localStorage.setItem("accessToken", data.access_token);
          localStorage.setItem("refreshToken", data.refresh_token);

          const decodedAccessToken = jwtDecode(data.access_token);
          // // Save the role
          if (decodedAccessToken && decodedAccessToken.role) {
            localStorage.setItem("userRole", decodedAccessToken.role);
          }
          if (decodedAccessToken && decodedAccessToken.card_id){
            localStorage.setItem('cardId', decodedAccessToken.card_id)
          }

          // Redirect to home page after successful login
          window.location.href = "/home"; 
          
        } else {
          console.error("Invalid token data:", data);
        }
      })
      .catch((error) => {
        // Handle error
        console.error(error);
        // Show error message to user
        alert("Login failed. Please check your email and password and try again.");
      });
  };
  return (
    <form onSubmit={handleSubmit} action="#">
      <div className="input-field">
        <label htmlFor="card_id">Card Id:</label>
        <input type="card_id" id="card_id" name="card_id" placeholder="ID"></input>
      </div>
      <div className="input-field">
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" placeholder="Password"></input>
      </div>
      <a href="/forgotpassword">Forgot password?</a>
      <button type="submit">Log in</button>
    </form>
  );
};

export default Login;
