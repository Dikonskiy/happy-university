import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { checkToken, generateCode, getCourses } from "../components/fetches";
import Topbar from "../components/Topbar";
import {Course} from "../components/Models";

const ManualAtt = () => {
  const role = localStorage.getItem("userRole");
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const refreshToken = localStorage.getItem("refreshToken");
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState("none");
  const [generated, setGenerated] = useState(false);
  const [code, setCode] = useState();
  const [course, setCourse] = useState("");
  const [status, setStatus] = useState();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const checkAccessToken = async () => {
      const newAccessToken = await checkToken(accessToken, refreshToken);
      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
      await fetchCourses();
    };
  
    const fetchCourses = async () => {
      await getCourses()
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch courses");
          }
        })
        .then((data) => {
          if (data.length !== 0){
            var getCourse = []; 
            for (let i = 0; i < data.length; i++){
              getCourse.push(new Course(data[i].course_code, data[i].course_name, '2+1', '5','45'));
            }
            setCourses(getCourse)
          }
          else {
            throw new Error("No courses found");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      setLoading(false);
    }
  
    checkAccessToken();
  }, [accessToken, refreshToken]);
  

  
  const handleButtonClick = (e) => {
    e.preventDefault();
    if (role === "Teacher"){
      setCourse(selectedOption)
      if (selectedOption!=="none"){
        generateCode(selectedOption)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to generate code");
          }
        })
        .then((data) => {
          if (data && data.code){
            setCode(data.code);
            setStatus("Generated successfully!");
            setGenerated(true);
          }
        })
        .catch((error) => {
          setStatus(error)
          console.error(error);
        });
      }
    }
    
      
  };
  
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
  };
    
    if (loading) {
      return <div className="loader"></div>;
    }
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
                      {courses.map(course => (
                        <option key={course.code} value={course.code}>
                          {course.code}
                        </option>
                      ))}   
                    </select>
                    <input className="show-button" type="button" value="Generate" disabled={generated} onClick={handleButtonClick}></input>
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
