import React from 'react';
import Info from './Info';

const Home = () => {
  return (
    <div className="box">
      <div>
        <h2 className="home-h2">Home Page</h2>
      </div>
      
      <div className="form-row">  
        <img src="https://oldmy.sdu.edu.kz/stud_photo.php?ses=c7c4d9bdd29e6e5e579c4056a5ef2d67&t=74" width="300" height="500" className="images" alt="Profile"/>
        <Info/>
      </div>
    </div>
  );
};

export default Home;