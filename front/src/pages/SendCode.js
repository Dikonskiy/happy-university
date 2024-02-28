import React, { useState } from 'react';

const SendCode = () => {
  const [code] = useState('');
  const [email] = useState('helloworld@gmail.com');
  const [timer, setTimer] = useState(120);

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
      <h1>Forgot Password</h1>
      <p>
        Please check your email <strong>{email}</strong>
      </p>
      <p>We've sent a code to your email address</p>
      <div className="code-timer">
        <span>{Math.floor(timer / 60)}:</span>
        <span>{('0' + (timer % 60)).slice(-2)}</span>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div>
          <input className="input-number" type="text_number" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
          <input className="input-number" type="text_number" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
          <input className="input-number" type="text_number" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
          <input className="input-number" type="text_number" maxLength="1" size="1" min="0" max="9" pattern="[0-9]{1}" />
        </div>
        <br></br>
        <button class="btn btn-primary btn-embossed" type="submit">Verify</button>
      </form>
      <button
        className="send-code-again"
        disabled={timer > 0}
        onClick={sendCodeAgain}
      >
        Send code again
      </button>
    </div>
  );
};

export default SendCode;
