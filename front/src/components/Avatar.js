import { useEffect, useState } from "react";
import { getImage } from "./fetches";

const Avatar = () => {
    const cardId = localStorage.getItem('cardId');
    const [image, setImage] = useState(null);

    useEffect (() => {
        try {
            getImage(cardId)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then((blob) => {
                    const imageUrl = "data:image/png;base64,"+blob.image;
                    setImage(imageUrl);
                });

        } catch (error) {
            console.error('Error fetching image:', error);
        }
    });


    return (
        <img className="images" src={image} alt="Profile" />
    ); 
}

export default Avatar; 