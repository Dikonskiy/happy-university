import React, { useEffect, useState } from "react";
import { checkToken, updatePassword } from "../components/fetches";

const ResetPassword = () => {
  var id = localStorage.getItem("userId");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    const checkAccessToken = async () => {
      // refresh token
      const newAccessToken = await checkToken(accessToken, refreshToken);
      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
      window.location.href = "/home";
    };

    if (accessToken && typeof accessToken === "string" && accessToken !== "undefined") {
      checkAccessToken();
    }
    if (id === null) {
      window.location.href = "/sign";
    } else {
      setLoading(false);
    }
  });


  const isFormValid = () => newPassword.length >= 8 && newPassword === confirmPassword;

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Implement your password reset logic here.
    updatePassword(id, newPassword)
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Password reset failed");
        }
      })
      .then((data) => {
        if (data) {
          if (data === "Password changed successfully") {
            window.alert("Password changed successfully");
            window.location.href = "/sign";
          }
        } else {
          console.error("Invalid data:", data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (loading) {
    return <div className="loader"></div>;
  }
  return (
    <div>
      <div className="form-wrapper">
        <h1>Reset Password</h1>
        <p>Please write something you'll remember</p>
        <form onSubmit={handleFormSubmit}>
          <div className="input-field">
            <label htmlFor="newPassword">New password</label>
            <input type="password" id="newPassword" placeholder="must be 8 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="input-field">
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input type="password" id="confirmPassword" placeholder="repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <br /> <br />
          <button type="submit" disabled={!isFormValid()}>
            Reset password
          </button>
          <p>
            Already have an account? <a href="/sign">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
