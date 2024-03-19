import React, { useState} from 'react';
import TableAtt from './TableAtt';

const Attendance = () => {
    const [term, setTerm] = useState('Term 2');
    const [termToUpdate, setTermToUpdate] = useState('');

    const handleSelectChange = (event) => {
        setTermToUpdate(event.target.value);
    };
    const handleButtonClick = () => {
        // Update the selected term with the termToUpdate
        setTerm(termToUpdate);
        // Reset the termToUpdate state
        setTermToUpdate('');
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