import React, { useEffect, useState } from "react";
import { afterRegistration, checkToken } from "../components/fetches";
import '../css/App.css'

const AftReg = () => {
  var id = localStorage.getItem("userId");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const refreshToken = localStorage.getItem("refreshToken");

  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  const minAspectRatio = 9 / 16;
  const maxAspectRatio = 1;

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
    }else{
      setLoading(false);
    }
    
  }, [accessToken, id, refreshToken]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const sizeInMB = file.size / (1024 * 1024);

          if (!allowedTypes.includes(file.type)) {
            setError("Please select a valid image file (JPEG, PNG, or GIF)");
            setImage(null);
          } else if (aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) {
            setError("Please upload an image with a profile aspect ratio between 9:16 and 1:1.");
            setImage(null);
          } else if (sizeInMB > 5) {
            setError("Please upload an image that is less than 5MB in size.");
            setImage(null);
          } else {
            setImage(reader.result);
            setError(null);
          }
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.clear();

    const birth = event.target.birth.value;
    if (image && birth) {
      afterRegistration(id, birth, image.split(",")[1])
      .then((response) => {
        if (response.ok) {
          return response;
        }
      })
      .catch((error) => {
        console.log(error);
      });

      window.location.href = "/sign";
    } else {
      alert("Please fill all the fields");
    }
  };
  if (loading) {
    return <div className="loader"></div>;
  } 
  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} action="#">
        <h1 className="logo">
          Account Created
          <br />
          Successfully
        </h1>
        <p style={{ color: "red" }}>
          Here you can see your Card ID. Remember, write <br />
          down, take screenshot and somehow save it.
        </p>
        <div className="form-row" style={{ fontWeight: "600" }}>
          <div className="td-info">Your ID: {id}</div>
        </div>
        <div className="input-field">
          <label htmlFor="image">Profile Image:</label>
          <div>
            <input className="" type="file" onChange={handleImageChange} accept="image/*" />
            {error && <div style={{ color: "red", marginTop: "5px" }}>{error}</div>}
            {image && <img src={image} alt="Uploaded" style={{ width: "200px", height: "200px", marginTop: "10px" }} />}
          </div>
        </div>
        <div className="input-field">
          <label htmlFor="birth">Birth Date:</label>
          <input className="custom" type="date" id="birth" name="birth" placeholder="Your birth" defaultValue="2000-02-29" />
        </div>
        <button type="submit">Join</button>
      </form>
    </div>
  );
  
};

export default AftReg;
