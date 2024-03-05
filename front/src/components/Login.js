import { authorization } from "./utils";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  //handle submit from Login form
  const handleSubmit = (e) => {
    //stay page dont refresh
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
          throw new Error("Login failed");
        }
      })
      .then((data) => {
        console.log(data)
        // Save the tokens
        if (data && data.access_token && data.refresh_token) {
          // TODO dont need decode tokens
          const decodedAccessToken = jwtDecode(data.access_token);
          console.log(data.access_token);
          localStorage.setItem("accessToken", decodedAccessToken);

          const decodedRefreshToken = jwtDecode(data.refresh_token);
          console.log(decodedRefreshToken);
          localStorage.setItem("refreshToken", decodedRefreshToken);

          // Redirect to home page after successful login
          // ! comment/uncomment for check
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
        <label htmlFor="email">Email address:</label>
        <input type="email" id="email" name="email" placeholder="Your email"></input>
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
