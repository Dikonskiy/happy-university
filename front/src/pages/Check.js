import React, { useEffect, useState } from "react";
import Stopwatch from "../components/Stopwatch";
import Sidebar from "../components/Sidebar";
import { checkToken } from "../components/fetches";
import Topbar from "../components/Topbar";

const Check = () => {
  const rooms = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "F101", "F102", "F103"];
  const [isDisabled, setIsDisabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState("none");

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  const isButtonDisabled = selectedOption === "none";

  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const refreshToken = localStorage.getItem("refreshToken");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccessToken = async () => {
      const newAccessToken = await checkToken(accessToken, refreshToken);
      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
      setLoading(false);
    };
    checkAccessToken();
  }, [accessToken, refreshToken]);

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="layout">
    <Sidebar />
    <div className="main">
    <Topbar />
    <div className="attendance-box">
    <h2 className="home-h2">Auto Check</h2>
    <div>
    <span className="ct">Room: </span>
    <select className="select-term" type="room" id="room" name="room" value={selectedOption} disabled={isDisabled} onChange={handleSelectChange}>
      <option value="none" disabled hidden>
        --Choose room--
      </option>
      {rooms.map((room) => (
        <option key={room} value={room}>
          {room}
        </option>
      ))}
    </select>
    <Stopwatch isDisabled={isButtonDisabled} onButtonClick={setIsDisabled} />
    </div>
    </div>
        </div>
      </div>
  );
};

export default Check;
