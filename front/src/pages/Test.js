import React, { useState } from 'react';
import { getImage, getBirthDate } from '../components/fetches';

const Test = () => {
    const [image, setImage] = useState(null);
    const [birthDate, setBirthDate] = useState(null);

    const handleButtonClick = async () => {
        try {
            
            getImage("13367869")
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then((blob) => {
                    const imageUrl = "data:image/png;base64,"+blob.image;
                    console.log(imageUrl)
                    setImage(imageUrl);
                });

            getBirthDate("13367869")
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                }) 
                .then((data) => {
                    console.log(data)
                    setBirthDate(data.birthday);
                });
                
                // const imageUrl = URL.createObjectURL(await getImage(23935007));
                // setImage(imageUrl);

        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Fetch Image</button>
            {birthDate && <p>Birth Date: {birthDate}</p>}
            {image && <img src={image} alt="Fetched Image" />}
        </div>
    );
};

export default Test;