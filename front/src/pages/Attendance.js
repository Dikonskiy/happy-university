import React, { useEffect, useState } from "react";
import TableAtt from "../components/TableAtt";
import CourseDetails from "../components/CourseDetails";
import { getCoursesStudent, checkToken } from "../components/fetches";
import Sidebar from "../components/Sidebar";
import Info from "../components/Info";
import Topbar from "../components/Topbar";

const Attendance = () => {
  // logic for define current term
  const date = new Date();
  const month = date.getMonth() + 1;
  var currentTerm = "";
  if ((month >= 9 && month <= 12) || month === 1) {
    currentTerm = "Term 1";
  } else {
    currentTerm = "Term 2";
  }

  const [term, setTerm] = useState(currentTerm);
  const [termToUpdate, setTermToUpdate] = useState(currentTerm);
  const [selectedCourse, setSelectedCourse] = useState(null); // Состояние для отслеживания выбранного курса
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const refreshToken = localStorage.getItem("refreshToken");
  const [loading, setLoading] = useState(true);
  // const [courses, setCourses] = useState(''); // ! backend dependency
  const role = localStorage.getItem("userRole");

  const handleSelectChange = (event) => {
    setTermToUpdate(event.target.value);
  };
  const handleButtonClick = (e) => {
    const checkAccessToken = async () => {
      const newAccessToken = await checkToken(accessToken, refreshToken);
      setAccessToken(newAccessToken, newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
    };
    // Update the selected term with the termToUpdate
    setTerm(termToUpdate);
    // Reset the termToUpdate state
    setTermToUpdate(termToUpdate);

    setLoading(true);
    checkAccessToken();

    // ! backend dependency
    // getCoursesStudent(term)
    //     .then((response) => {
    //         if(response.ok){
    //             return response.json();
    //         }
    //         else if (response.status === 401){
    //             localStorage.clear();
    //             window.location.href = '/login';
    //         }
    //         else {
    //             throw new Error("Server error");
    //         }
    //     })
    //     .then((courses) => {
    //         if (courses && courses.code && courses.name && courses.hours && courses.attendance && courses.absence && courses.absenceLimit && courses.absencePercentage){
    //             setCourses(JSON.stringify(courses));
    //         } else {
    //             throw new Error('Invalid courses data: ', courses);
    //         }
    //     })
    //     .catch((error) => {
    //         console.error(error);
    //     });
    setLoading(false);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course); // Установить выбранный курс
  };

  const handleReturn = () => {
    setSelectedCourse(null); // Сбросить выбранный курс при нажатии на кнопку "Назад"
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

  useEffect(() => {
    const checkAccessToken = async () => {
      const newAccessToken = await checkToken(accessToken, refreshToken);
      setAccessToken(newAccessToken);
      localStorage.setItem("accessToken", newAccessToken);
      // setIsAuthenticated(true); // ? mb need
      // await fetchAttendanceData(); // ! backend dependecy
    };
    // ! backend dependecy
    //     const fetchAttendanceData = async () => {
    //         getCoursesStudent(term)
    //             .then((response) => {
    //                 if(response.ok){
    //                     return response.json();
    //                 }
    //                 else if (response.status === 401){
    //                     localStorage.clear();
    //                     window.location.href = '/login';
    //                 }
    //                 else {
    //                     throw new Error("Server error");
    //                 }
    //             })
    //             .then((courses) => {
    //                 if (courses && courses.code && courses.name && courses.hours && courses.attendance && courses.absence && courses.absenceLimit && courses.absencePercentage){
    //                     setCourses(JSON.stringify(courses));
    //                 } else {
    //                     throw new Error('Invalid courses data: ', courses);
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error(error);
    //             });
    //         setLoading(false);
    //     }
    //
    checkAccessToken();
  }, []);
  // ! backend dependecy
  // if (loading) {
  //     return (
  //         <div className="loader"></div>
  //     );
  // }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="attendance-box">
          {selectedCourse ? (
            <div>
              <button onClick={handleReturn} className="show-button">
                {"< "}Back
              </button>
              <h2 className="home-h2">{selectedCourse.code}</h2>
              <label className="gray-label">{selectedCourse.name}</label>
              <CourseDetails course={selectedCourse} />
            </div>
          ) : (
            <div>
              {role === "Teacher" && <h2 className="home-h2">Course Schedule</h2>}
              {role === "Student" && <h2 className="home-h2">Electronic Attendance</h2>}

              <div className="choose">
                <div className="form-row">
                  <span className="ct">Year and term:</span>
                  <select className="select-term" type="role" id="role" name="role" required="" defaultValue={currentTerm} onChange={handleSelectChange}>
                    <option value="Term 2">2nd term</option>
                    <option value="Term 1">1st term</option>
                  </select>
                  <input className="show-button" type="button" value="Show" onClick={handleButtonClick}></input>
                </div>
                <label className="gray-label">{term}</label>
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
