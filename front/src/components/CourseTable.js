import React from 'react';

const CourseTable = ({ course }) => {
    let count = 0;
    
    return (
        <table className='course-table'>
            <tbody>
                <tr className='course-row'>
                    <td width="20"></td>
                    <td width="80" align="center"><b>Code</b></td>
                    <td width="180"><b>Course name</b></td>
                    <td width="60" align="center" title="Credits"><b>Credits</b></td>
                    <td width="40" align="center" title="ECTS"><b>ECTS</b></td>
                    <td width="45" align="center" title="Course hour"><b>Hours</b></td>
                </tr>
                {course.map(course => (
                <tr key={course.code} className='course-row'>
                    <td className='course-td'>{++count}</td>
                    <td className='course-td'></td>
                    <td className='course-td'>{course.name}</td>
                    <td align="center" className='course-td'>{course.credits}</td>
                    <td align="center" className='course-td'>{course.ects}</td>
                    <td align="center" className='course-td'>{course.hours}</td>
                </tr>
                ))}
            </tbody>
        </table>
  );
};

export default CourseTable;
