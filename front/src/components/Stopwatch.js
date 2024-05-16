import React, { useState, useEffect, useRef } from "react";

const Stopwatch = ({ isDisabled, onButtonClick }) => {
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState("00:00:00");

  const handleToggle = () => {
    if (isRunning) {
      clearInterval(timeInterval.current);
    } else {
      timeInterval.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 10);
    }
    setIsRunning(!isRunning);
    onButtonClick(true);
  };

  const handleReset = () => {
    clearInterval(timeInterval.current);
    setTimer(0);
    setTimeDisplay("00:00:00");
    setIsRunning(false);
    onButtonClick(false);
  };

  const formatTime = (timer) => {
    const hours = Math.floor(timer / 360000)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((timer % 360000) / 6000)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((timer % 6000) / 100)
      .toString()
      .padStart(2, "0");
    const milliseconds = (timer % 100).toString().padStart(2, "0");
    return `${hours !== "00" ? hours + ":" : ""}${minutes}:${seconds}${hours === "00" ? ":" + milliseconds : ""}`;
  };

  useEffect(() => {
    setTimeDisplay(formatTime(timer));
  }, [timer]);

  let timeInterval = useRef(null);

  return (
    <div>
      <button onClick={handleToggle} disabled={isDisabled}>
        {isRunning ? "Out" : "Join"}
      </button>
      <button onClick={handleReset} disabled={isDisabled}>
        Reset
      </button>
      <div className="circle">
        <span className="time">{timeDisplay}</span>
      </div>
    </div>
  );
};

export default Stopwatch;
