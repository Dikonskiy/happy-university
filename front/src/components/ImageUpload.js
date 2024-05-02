import React, { useState } from 'react';

const ImageUpload = () => {
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

  return (
    <div>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      {error && <div style={{ color: 'red', marginTop: '5px' }}>{error}</div>}
      {image && <img src={image} alt="Uploaded" style={{ width: '200px', height: '200px', marginTop: '10px' }} />}
    </div>
  );
}

export default ImageUpload;
