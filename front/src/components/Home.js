import React from 'react';
import Info from './Info';

const Home = () => {
  return (
    <div className="box">
      <div>
        <h2 className="home-h2">Home Page</h2>
      </div>
      
      <div className="form-row">  
        <img src="https://oldmy.sdu.edu.kz/stud_photo.php?ses=e69f85cc9b0d3a6f75a2a26b292a05f3&t=63" width="300" height="500" className="images" alt="Profile"/>
        <Info/>
      </div>
    </div>
  );
};

export default Home;