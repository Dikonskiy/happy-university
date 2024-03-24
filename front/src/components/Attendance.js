import React, { useState} from 'react';
import TableAtt from './TableAtt';
import CourseDetails from './CourseDetails'

const Attendance = () => {
    const [term, setTerm] = useState('Term 2');
    const [termToUpdate, setTermToUpdate] = useState('Term 2');
    const [selectedCourse, setSelectedCourse] = useState(null); // Состояние для отслеживания выбранного курса


    const handleSelectChange = (event) => {
        setTermToUpdate(event.target.value);
    };
    const handleButtonClick = () => {
        // Update the selected term with the termToUpdate
        setTerm(termToUpdate);
        // Reset the termToUpdate state
        setTermToUpdate(termToUpdate);
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
          permission: 0
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
    return (
        <div className="attendance-box">
            {selectedCourse ? ( 
            <div>
                <h2 className='home-h2'>Course Details</h2>
                <CourseDetails course={selectedCourse} onReturn={handleReturn} />
            </div>
            ) : (
            <div>
                <h2 className="home-h2">Electronic Attendance</h2>
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
                    <TableAtt courses={courses} handleCourseClick={handleCourseClick} /> 
                </div>
            </div>
            )}
        </div>
    );
};  

export default Attendance;