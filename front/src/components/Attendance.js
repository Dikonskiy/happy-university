import React, { useEffect, useState} from 'react';
import TableAtt from './TableAtt';
import CourseDetails from './CourseDetails'
import { takeAttendanceDataForStudent } from '../components/utils'

const Attendance = () => {

    // logic for define current term
    const date = new Date();
    const month = date.getMonth() + 1;
    var currentTerm = '';
    if ((month >= 9 && month <= 12) || month === 1) {
        currentTerm = 'Term 1';
    } else {
        currentTerm = 'Term 2';
    }

    const [term, setTerm] = useState(currentTerm);
    const [termToUpdate, setTermToUpdate] = useState(currentTerm);
    const [selectedCourse, setSelectedCourse] = useState(null); // Состояние для отслеживания выбранного курса
    const [loading, setLoading] = useState(true);
    // const [courses, setCourses] = useState(''); // ! backend dependency
    const role = localStorage.getItem('userRole');

    const handleSelectChange = (event) => {
        setTermToUpdate(event.target.value);
    };
    const handleButtonClick = (e) => {
        // Update the selected term with the termToUpdate
        setTerm(termToUpdate);
        // Reset the termToUpdate state
        setTermToUpdate(termToUpdate);

    // ! backend dependency
        // takeAttendanceDataForStudent(term)
        //     .then((response) => {
        //         if(response.ok){
        //             return response.json();
        //         }
        //         else if (response.status === 401){
        //             localStorage.removeItem('accessToken');
        //             localStorage.removeItem('refreshToken');
        //             localStorage.removeItem('activeTab');
        //             localStorage.removeItem('userData');
        //             localStorage.removeItem('userRole');
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
    };

    const handleCourseClick = (course) => {
        setSelectedCourse(course); // Установить выбранный курс
    };

    const handleReturn = () => {
        setSelectedCourse(null); // Сбросить выбранный курс при нажатии на кнопку "Назад"
    };

    const courses = [
        { 
          code: 'CSS 342',
          name: 'Software Engineering',
          credits: '2+1+0',
          ects: 5,
          hours: 45,
          attendance: 12,
          absence: 1,
          permission: 2
        },
        { 
          code: 'CSS 152',
          name: 'Physics',
          credits: '2+1+0',
          ects: 5,
          hours: 45,
          attendance: 30,
          absence: 10,
          permission: 0
        },
        { 
          code: 'INF 423',
          name: 'Statistics',
          credits: '2+1+0',
          ects: 5,
          hours: 45,
          attendance: 28,
          absence: 8,
          permission: 0
        }
    ];
    // ! backend dependecy 
    // useEffect(() => {
    //     const fetchAttendanceData = async () => {
    //         takeAttendanceDataForStudent(term)
    //             .then((response) => {
    //                 if(response.ok){
    //                     return response.json();
    //                 }
    //                 else if (response.status === 401){
    //                     localStorage.removeItem('accessToken');
    //                     localStorage.removeItem('refreshToken');
    //                     localStorage.removeItem('activeTab');
    //                     localStorage.removeItem('userData');
    //                     localStorage.removeItem('userRole');
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
    //     fetchAttendanceData();
    // }, []);

    // if (loading) {
    //     return (
    //         <div className="loader"></div>
    //     );
    // }

    return (
        <div className="attendance-box">
            {selectedCourse ? ( 
            <div>
                <button onClick={handleReturn} className='show-button'>{'< '}Back</button>
                <h2 className='home-h2'>{selectedCourse.code}</h2>
                <label className='gray-label'>{selectedCourse.name}</label>
                <CourseDetails course={selectedCourse} />
            </div>
            ) : (
            <div>
                {role === 'Teacher' && (
                    <h2 className="home-h2">Course Schedule</h2>
                )}
                {role === 'Student' && (
                    <h2 className="home-h2">Electronic Attendance</h2>
                )}
                
                <div className="choose">
                    <div className='form-row'>
                        <span className="ct">Year and term:</span>
                        <select className="select-term" type="role" id="role" name="role" required="" defaultValue={currentTerm} onChange={handleSelectChange}>
                            <option value="Term 2">2nd term</option>
                            <option value="Term 1">1st term</option>
                        </select>
                        <input className="show-button" type='button' value='Show' onClick={handleButtonClick}></input>
                        {role === 'Teacher' && (
                            <input className="show-button" type='button' value='Check'></input>
                        )}
                    </div>  
                    <label className='gray-label'>{ term }</label>
                    <TableAtt courses={courses} handleCourseClick={handleCourseClick} /> 
                </div>
            </div>
            )}
        </div>
    );
};  

export default Attendance;