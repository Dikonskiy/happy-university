import React, { useEffect, useState } from "react";
import TableAtt from "../components/TableAtt";
import CourseDetails from "../components/CourseDetails";
import { checkToken, getCourses } from "../components/fetches";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Course } from "../components/Models"

const Attendance = () => {
  const [selectedCourse, setSelectedCourse] = useState(null); // Состояние для отслеживания выбранного курса
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const refreshToken = localStorage.getItem("refreshToken");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]); 
  const role = localStorage.getItem("userRole");
  
  const handleCourseClick = (course) => {
    setSelectedCourse(course); // Установить выбранный курс
  };

  useEffect(() => {
    const checkAccessToken = async () => {
      const newAccessToken = await checkToken(accessToken, refreshToken);
      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
      await fetchCourses()
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

  if (loading) {
      return (
          <div className="loader"></div>
      );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="attendance-box">
          {selectedCourse ? (
            <div>
              <nav className="nav">
                <ul className="form-row">
                  <li><a style={{color:"black"}} href="/home">Home</a></li>
                  <li>{'>'}</li>
                  <li><a style={{color:"black"}} href="/attendance">Attendance</a></li>
                  <li>{'>'}</li>
                  <li>Course Details</li>
                </ul> 
              </nav>
              <h2 className="home-h2">{selectedCourse.code}</h2>
              <label className="gray-label">{selectedCourse.name}</label>
              <CourseDetails course={selectedCourse} />
            </div>
          ) : (
            <div>
              {role === "Teacher" && <h2 className="home-h2">Course Schedule</h2>}
              {role === "Student" && <h2 className="home-h2">Electronic Attendance</h2>}

              <div className="choose">
                <TableAtt courses={courses} handleCourseClick={handleCourseClick} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
