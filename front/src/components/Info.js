import React from "react";

const Info = () => {
    let user = JSON.parse(localStorage.getItem('userData'))
    return (
        <div className="user-info">
            <div className="form-row">
                <div className="td-info">Name Surname:</div>
                <div className="td-info">{user.name}</div>
            </div>
            
            <div className="form-row">
                <div className="td-info">ID:</div> 
                <div className="td-info">{user.card_id}</div>
            </div>

            <div className="form-row">
                <div className="td-info">Email:</div>
                <div className="td-info">{user.email}</div>
            </div>
        </div>
    );
};

export default Info;