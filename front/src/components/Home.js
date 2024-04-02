import React from 'react';
import Info from './Info';

const Home = () => {
  return (
    <div className="box">
      <div>
        <h2 className="home-h2">Home Page</h2>
      </div>
      
      <div className="form-row">  
        <img src="../stud_photo.jpg" width="300" height="500" className="images" alt="Profile"/>
        <Info/>
      </div>
    </div>
  );
};

export default Home;