import { useEffect, useState } from "react";
import { checkToken, getImage } from "./fetches";

const Avatar = () => {
    const cardId = localStorage.getItem('cardId');
    const [image, setImage] = useState(null);

    useEffect (() => {
        const checkAccessToken = async () => {
            const newAccessToken = await checkToken(localStorage.getItem("accessToken"), localStorage.getItem("refreshToken"));
            localStorage.setItem('accessToken', newAccessToken);
            await fetchImage();
        }
        const fetchImage = async () => {
            try {
                await getImage(cardId)
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
        }

        checkAccessToken();
    });


    return (
        <img className="images" src={image} alt="Profile" />
    ); 
}

export default Avatar;
