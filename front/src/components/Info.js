import React from "react";

const Info = () => {
    return (
        <div className="user-info">
            <div className="form-row">
                <div className="td-info">Name Surname:</div>
                <div className="td-info">John Lee</div>
            </div>
            
            <div className="form-row">
                <div className="td-info">ID:</div> 
                <div className="td-info">24010487</div>
            </div>

            <div className="form-row">
                <div className="td-info">Email:</div>
                <div className="td-info">germanlee@happy.edu.kz</div>
            </div>
        </div>
    );
};

export default Info;