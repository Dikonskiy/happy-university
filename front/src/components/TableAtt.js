import React from 'react';

const TableAtt = ({ courses }) => {
    let count = 0;
    return (
        <table className='course-table'>
        <tbody>
            <tr className='course-row'>
                <td width="25">&nbsp;</td>
                <td align="left" width="60"><b>Code</b></td>
                <td width="180"><b>Course name</b></td>
                <td width="40" align="center" title="Course hour"><b>Hours</b></td>
                <td width="80" align="center" title="Attendance"><b>Attendance</b></td>
                <td width="80" align="center" title="Absent"><b>Absence</b></td>
                {/* <td className='course-td' width="180" align="center" title="Absence limit for the course"><b>10</b></td> */}
                <td width="180" align="center" title=""><b>Absence % (Limit: 30%)</b></td>
            </tr>
            {courses.map(course => (
            <tr key={course.code} className='course-row'>
                <td className='course-td'>{++count}</td>
                <td className='course-td'>{course.code}</td>
                <td className='course-td'>{course.name}</td>
                <td align="center" className='course-td'>{course.hours}</td>
                <td align="center" className='course-td'>{course.attendance}</td>
                <td align="center" className='course-td'>{course.absence}</td>
                {/* <td align="center" className='course-td'>{course.absenceLimit}</td> */}
                <td align="center" className='course-td'>{course.absencePercentage}%</td>
            </tr>
            ))}
        </tbody>
    </table>
  );
};

export default TableAtt;
