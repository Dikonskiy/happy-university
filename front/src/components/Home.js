import React from 'react';

const Home = () => {
  return (
    <div className="box">
      <div>
        <h2 className="home-h2">Home Page</h2>
      </div>
      
      <div className="box-info">
        <img src="https://cdn-icons-png.flaticon.com/512/6063/6063620.png" width="400" height="600" className="img-fluid rounded" alt="Profile"/>
        <div>
          <p>Name Surname:</p>
          <p>ID:</p>
          <p>Email:</p>
        </div>
      </div>
    </div>
  );
};

export default Home;