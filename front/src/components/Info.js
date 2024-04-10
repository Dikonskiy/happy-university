import React, { useState, useEffect } from 'react';
import { takeUserData, checkToken } from '../components/fetches';

const Info = () => {
    const [userData, setUser] = useState();
    const cardId = localStorage.getItem('cardId');
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const refreshToken = localStorage.getItem('refreshToken');

    useEffect(() => {
        const checkAccessToken = async () => {
            const newAccessToken = await checkToken(accessToken, refreshToken);
            setAccessToken(newAccessToken, newAccessToken)
            localStorage.setItem('accessToken', newAccessToken);
            await fetchInfo();
        }
        const fetchInfo = async () => {
            await takeUserData(cardId)
                .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401){
                    localStorage.clear();
                    window.location.href = '/login';
                } else {
                    throw new Error('Token check failed');
                }
                })
                .then((data) => {
                if (data && data.name && data.card_id && data.email) {
                    localStorage.setItem('userData', JSON.stringify(data));
                    setUser(JSON.stringify(data));
                } else{
                    throw new Error('Invalid user data: ', userData);
                }
                })
                .catch((error) => {
                    console.error(error);
                });
        }

        checkAccessToken();
    }, [accessToken, refreshToken, cardId, userData]);

    if (userData){
        const user = JSON.parse(userData);
        return (
            <div className="user-info">
                <div className="form-row">
                    <div className="td-info">Name Surname:</div>
                    <div className="td-info">{user.name}</div>
                </div>
                
                <div className="form-row">
                    <div className="td-info">ID: </div> 
                    <div className="td-info">{user.card_id}</div>
                </div>
        
                <div className="form-row">
                    <div className="td-info">Email: </div>
                    <div className="td-info">{user.email}</div>
                </div>
            </div>
        );
    }
};

export default Info;
