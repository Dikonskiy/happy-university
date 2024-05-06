/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import TableAtt from "../components/TableAtt";
import CourseDetails from "../components/CourseDetails";
import { checkToken, getCourses } from "../components/fetches";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Course } from "../components/Models";

const Attendance = () => {
  const [selectedCourse, setSelectedCourse] = useState(null); // Состояние для отслеживания выбранного курса
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const role = localStorage.getItem("userRole");

  const handleCourseClick = (course) => {
    setSelectedCourse(course); // Установить выбранный курс
  };

  useEffect(() => {
    const checkAccessToken = async () => {
      const newAccessToken = await checkToken(localStorage.getItem("accessToken"), localStorage.getItem("refreshToken"));
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
          if (data.length !== 0) {
            var getCourse = [];
            for (let i = 0; i < data.length; i++) {
              getCourse.push(new Course(data[i].course_code, data[i].course_name, "2+1", "5", 45));
            }
            setCourses(getCourse);
          } else {
            throw new Error("No courses found");
          }
        })
        .catch((error) => {
          console.error(error);
        });

        
        setLoading(false)
      };
      
      checkAccessToken();
  }, []);

  const handleReturn = () => {
    setSelectedCourse(null); // Сбросить выбранный курс при нажатии на кнопку "Назад"
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
          {selectedCourse ? (
            <div>
              <nav className="nav">
                <ul className="form-row">
                  <li className="li-first">
                    <a onClick={handleReturn} href="/attendance" className="link">
                      Attendance
                    </a>
                  </li>
                  <li>{">"}</li>
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
                <ul className="form-row">
                  <li>
                    <i className="fas fa-check-circle"></i>
                    <span>Attendance</span>
                  </li>
                  <li>
                    <i className="fas fa-times-circle"></i>
                    <span>Absent</span>
                  </li>
                  <li>
                    <i className="fas fa-info-circle"></i>
                    <span>Permission</span>
                  </li>
                  <li>
                    <i className="fas fa-pencil-alt"></i>
                    <span>Manual</span>
                  </li>
                  {/* Add more icon and definition pairs as needed */}
                </ul>
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
