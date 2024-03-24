import React, { useState} from 'react';
import TableAtt from './TableAtt';
import { takeAttendanceDataForStudent } from '../components/utils'

const Attendance = () => {

    // logic for define current term
    const date = new Date();
    const month = date.getMonth() + 1;
    if (month >= 9 && month <= 12 || month == 1) {
        var currentTerm = 'Term 1';
    } else {
        var currentTerm = 'Term 2';
    }

    const [term, setTerm] = useState(currentTerm);
    const [termToUpdate, setTermToUpdate] = useState('');
    // const [courses, setCourses] = useState(''); // ! backend dependency

    const handleSelectChange = (event) => {
        setTermToUpdate(event.target.value);
    };
    const handleButtonClick = (e) => {
        // Update the selected term with the termToUpdate
        setTerm(termToUpdate);
        // Reset the termToUpdate state
        setTermToUpdate('');

    // ! backend dependency
    //     takeAttendanceDataForStudent(termToUpdate)
    //         .then((response) => {
    //             if(response.ok){
    //                 return response.json();
    //             }
    //             else if (response.status === 401){
    //                 localStorage.removeItem('accessToken');
    //                 localStorage.removeItem('refreshToken');
    //                 localStorage.removeItem('activeTab');
    //                 localStorage.removeItem('userData');
    //                 localStorage.removeItem('userRole');
    //                 window.location.href = '/login';
    //             }
    //             else {
    //                 throw new Error("Server error");
    //             }
    //         })
    //         .then((courses) => {
    //             if (courses && courses.code && courses.name && courses.hours && courses.attendance && courses.absence && courses.absenceLimit && courses.absencePercentage){
    //                 setCourses(JSON.stringify(courses));
    //             } else {
    //                 throw new Error('Invalid courses data: ', courses);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    };

    const courses = [
        { 
          code: 'CSS 342',
          name: 'Software Engineering',
          hours: 3,
          attendance: 25,
          absence: 5,
          absenceLimit: 30,
          absencePercentage: 20 
        },
        { 
          code: 'CSS 152',
          name: 'Physics',
          hours: 4,
          attendance: 30,
          absence: 10,
          absenceLimit: 30,
          absencePercentage: 33 
        },
        { 
          code: 'INF 423',
          name: 'Statistics',
          hours: 3,
          attendance: 28,
          absence: 8,
          absenceLimit: 30,
          absencePercentage: 27 
        }
    ];
    return (
        <div className="attendance-box">
            <div>
                <h2 className="home-h2">Electronic Attendance</h2>
            </div>
            <div className="choose">
                <div className='form-row'>
                    <span className="ct">Year and term:</span>
                    <select className="select-term" type="role" id="role" name="role" required="" onChange={handleSelectChange}>
                        <option value="Term 2">2nd term</option>
                        <option value="Term 1">1st term</option>
                    </select>
                    <input className="show-button" type='button' value='Show' onClick={handleButtonClick}></input>
                </div>  
                <label className='gray-label'>{ term }</label>
                <div>
                    <TableAtt courses={courses} />
                </div>
            </div>
        </div>
    );
};  

export default Attendance;