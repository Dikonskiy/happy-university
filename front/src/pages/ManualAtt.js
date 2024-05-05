import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { checkToken } from "../components/fetches";
import Topbar from "../components/Topbar";

const ManualAtt = () => {
  const role = localStorage.getItem("userRole");
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const refreshToken = localStorage.getItem("refreshToken");
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("none");
  const [generated, setGenerated] = useState(false);
  const [code, setCode] = useState("12131315");
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState("status");

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

  const handleButtonClick = (e) => {
    e.preventDefault();
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };

  var courses = [
    {
      code: "CSS 342",
      name: "Software Engineering",
      credits: "2+1+0",
      ects: 5,
      hours: 45,
      attendance: 12,
      absence: 1,
      permission: 2,
    },
    {
      code: "CSS 152",
      name: "Physics",
      credits: "2+1+0",
      ects: 5,
      hours: 45,
      attendance: 30,
      absence: 10,
      permission: 0,
    },
    {
      code: "INF 423",
      name: "Statistics",
      credits: "2+1+0",
      ects: 5,
      hours: 45,
      attendance: 28,
      absence: 8,
      permission: 0,
    },
  ];

  return (
    <div className="layout">
        <Sidebar />
        <div className="main">
            <Topbar />
            <div className="attendance-box">
                {role === "Student" && 
                <div>
                  <h2 className="home-h2">Manual Attendance</h2>
                  <p>Enter your code from teacher for participate to class</p>
                  <div>
                      <span className="ct">Code: </span>
                      <input 
                      className="select-term" 
                      type="code" id="code" 
                      name="code"
                      placeholder="Enter code here">
                      </input>
                      <input className="show-button" type="button" value="Enter" onClick={handleButtonClick}></input>
                  </div>
                </div>
                }
                {role === "Teacher" && 
                <div>
                  <h2 className="home-h2">Start Class</h2>
                  <div className="generate-code">
                    <span className="ct">Code: </span>
                    <select className="select-term" type="course" id="course" name="course" value={selectedOption} onChange={handleSelectChange}>
                      <option value="none" disabled hidden>
                        --Choose course--
                      </option>
                      {courses.map((course) => (
                        <option key={course.code} value={course.code}>
                          {course.code}
                        </option>
                      ))}
                    </select>
                    <input className="show-button" type="button" value="Generate" onClick={handleButtonClick}></input>
                  </div>
                  <div className="status">
                      <p>{status}</p>
                  </div>
                  <br/>
                  <br/>
                  <br/>
                  <div className="generated-code">
                    <h1>{code}</h1>
                  </div>
                </div>
                }
                {role === "Admin" && <h2 className="home-h2">Work with Attendance</h2>}
                
            </div>
        </div>
    </div>
  );
};

export default ManualAtt;
