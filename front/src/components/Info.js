import React, { useState, useEffect } from 'react';
import { takeUserData, checkToken, getBirthDate } from '../components/fetches';

const Info = () => {
    const [userData, setUser] = useState();
    const cardId = localStorage.getItem('cardId');
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const refreshToken = localStorage.getItem('refreshToken');
    const [birthDate, setBirthDate] = useState(null);
    const role = localStorage.getItem('userRole');

    const path = window.location.pathname
    .split("/").filter(path => path !== "");
    const tab = path[path.length - 1];

    useEffect(() => {
        const checkAccessToken = async () => {
            const newAccessToken = await checkToken(accessToken, refreshToken);
            setAccessToken(newAccessToken, newAccessToken)
            localStorage.setItem('accessToken', newAccessToken);
            await fetchInfo();
        }
        const fetchInfo = async () => {
            await takeUserData()
                .then((response) => {
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401){
                    localStorage.clear();
                    window.location.href = '/sign';
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

            if (tab === 'home'){
                await getBirthDate(cardId)
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        }
                    }) 
                    .then((data) => {
                        setBirthDate(data.birthday);
                    });
            }
        }

        checkAccessToken();
    }, [accessToken, refreshToken, cardId, userData, tab]);

    if (userData){
        const user = JSON.parse(userData);
        return (
            <div className="form-row" style={{padding:"20px"}}>
                <div className="form" style={{marginRight:"10px"}}>
                    <div className="td-info">Full Name:</div>
                    <div className="td-info">ID: </div> 
                    <div className="td-info">Email: </div>
                    <div className="td-info">Role: </div>
                    {tab === 'home' && 
                    <div className="td-info">Birth Date: </div>
                    }
                </div>
                
                <div className="form">
                    <div className="td-info">{user.name}</div>
                    <div className="td-info">{user.card_id}</div>
                    <div className="td-info">{user.email}</div>
                    <div className="td-info">{role}</div>
                    {tab === 'home' && 
                    <div className="td-info">{birthDate}</div>
                    }
                </div>
            </div>
        );
    }
};

export default Info;
