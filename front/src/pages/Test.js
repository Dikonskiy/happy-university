import React, { useState } from 'react';
import { getImage } from '../components/fetches';

const Test = () => {
    const [image, setImage] = useState(null);

    const handleButtonClick = async () => {
        try {
            
            getImage("23386263")
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
                
                // const imageUrl = URL.createObjectURL(await getImage(23935007));
                // setImage(imageUrl);

        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    return (
        <div>
            <button onClick={handleButtonClick}>Fetch Image</button>
            {image && <img src={image} alt="Fetched Image" />}
        </div>
    );
};

export default Test;