import React, { useState } from 'react';
import { afterRegistration } from '../components/fetches';

const AftReg = () => {
  const id = localStorage.getItem('userId').replaceAll("\"", "")
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Check if the selected file is an image
    if (file && allowedTypes.includes(file.type)) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
        setError(null);
      };

      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setError('Please select a valid image file (JPEG, PNG, or GIF)');
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault(); 
    localStorage.clear();

    afterRegistration(id, event.target.birth.value, image.split(',')[1])
        .then((response) => {
            if (response.ok) {
              return response;
            }
          })
          .catch((error) => {
            console.log(error);
          });
          
    window.location.href = '/sign';

  };

  return (
    <div className="form-wrapper">
        <form onSubmit={handleSubmit} action="#">
            <h1 className='logo'>Account Created<br/>Successfully</h1>
                <p style={{color: 'red'}}>Here you can see your Card ID. Remember, write <br/>down, take screenshot and somehow save it.</p>                
                <div className="form-row" style={{fontWeight: '600'}}>
                  <div className="td-info">Your ID: {id}</div>
                </div>
            <div className="input-field">
                <label htmlFor="image">Profile Image:</label>
                <div>
                  <input type="file" onChange={handleImageChange} accept="image/*" />
                  {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
                  {image && <img src={image} alt="Uploaded" style={{ width: '200px', height: '200px', marginTop: '10px' }} />}
                </div>
            </div>
            <div className="input-field">
                <label htmlFor="birth">Birth Date:</label>
                <input className="custom" type="date" id="birth" name="birth" placeholder="Your birth" defaultValue="2000-02-29"/>
            </div>
            <button type="submit">
                Join
            </button>
        </form>
    </div>
  );
};

export default AftReg;
