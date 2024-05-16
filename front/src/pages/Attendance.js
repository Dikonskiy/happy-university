/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import TableAtt from "../components/TableAtt";
import CourseDetails from "../components/CourseDetails";
import { checkToken, getCourseInfo } from "../components/fetches";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Attendance = () => {
  const [selectedCourse, setSelectedCourse] = useState(null); // Состояние для отслеживания выбранного курса
  const [courseCount, setCourseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [lectures, setLecture] = useState([]);
  const [practices, setPractice] = useState([]);
  const role = localStorage.getItem("userRole");

  const handleCourseClick = (course, index) => {
    setSelectedCourse(course); // Установить выбранный курс
    setCourseCount(index);
  };

  useEffect(() => {
    const checkAccessToken = async () => {
      const newAccessToken = await checkToken(localStorage.getItem("accessToken"), localStorage.getItem("refreshToken"));
      localStorage.setItem("accessToken", newAccessToken);
      await fetchCourses();
    }; 

    const fetchCourses = async () => {
      if (localStorage.getItem("userRole") ==="Student") {
        const coursesInfo = await getCourseInfo();

        setCourses(coursesInfo.courses);
        setLecture(coursesInfo.lectures);
        setPractice(coursesInfo.practices);
      } 
      if (localStorage.getItem("userRole") === "Teacher") {
        const coursesInfo = await getCourseInfo();
        setCourses(coursesInfo.courses);
      }
        setLoading(false)
      };
      
      checkAccessToken();
  }, []);

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
                    <a href="/attendance" className="link">
                      Attendance
                    </a>
                  </li>
                  <li>{">"}</li>
                  <li>Course Details</li>
                </ul>
              </nav>
              <h2 className="home-h2">{selectedCourse.code}</h2>
              <label className="gray-label">{selectedCourse.name}</label>
              <CourseDetails course={selectedCourse} lecture={lectures[courseCount]} practice={practices[courseCount]}/>
            </div>
          ) : (
            <div>
              {role === "Teacher" && <h2 className="home-h2">Course Schedule</h2>}
              {role === "Student" && <h2 className="home-h2">Electronic Attendance</h2>}

              <div className="choose">
                {role === "Student" && (
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
                </ul>)}
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
