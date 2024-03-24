import React, { useState } from 'react';
import InputCode from "../components/InputCode";
import '../css/resetPassword.css'

const SendCode = () => {
  const [code] = useState('4');
  const [email] = useState('helloworld@gmail.com');
  const [timer, setTimer] = useState(120);
  
  const [loading, setLoading] = useState(false);
  // const handleInputChange = (e) => {
  //   setEmail(e.target.value);
  // };

  // const handleCodeChange = (index, value) => {
  //   const newCode = code.split('');
  //   newCode[index] = value;
  //   setCode(newCode.join(''));
  // };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Реализуйте здесь логику сброса пароля.
    console.log('Email:', email);
    console.log('Code:', code);
  };

  const sendCodeAgain = () => {
    // Реализуйте здесь логику отправки кода повторно.
    console.log('Code resent.');
    setTimer(120);
  };

  React.useEffect(() => {
    if (timer > 0) {
      const timerId = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    }
  }, [timer]);

  

  return (
      <div className="form-wrapper">
        <h1>Please check your email</h1>
        <p>
          We've sent a code to <strong>{email}</strong>
        </p>
        <form onSubmit={handleFormSubmit}>
          <InputCode
          length={4}
          label="Code Label"
          loading={loading}
          onComplete={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 10000);
          }}
          />
          <button className="btn btn-primary btn-embossed" type="submit">Verify</button>
        </form>
        <br/> 
        <div className="form-row">
          <button
            className ="send-code-again"
            disabled={timer > 0}
            onClick={sendCodeAgain}
          >
            Send code again
          </button>
          <div className="code-timer">
            <span>{Math.floor(timer / 60)}:</span>
            <span>{('0' + (timer % 60)).slice(-2)}</span>
          </div>
        </div>
      </div>
  );
};

export default SendCode;
