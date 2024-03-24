import React from 'react';

const TableAtt = ({ courses, handleCourseClick }) => {
    let count = 0;
    
    const role = localStorage.getItem('userRole');
    
    return (
        <table className='course-table'>
            <tbody>
                <tr className='course-row'>
                    <td width="25">&nbsp;</td>
                    <td align="left" width="60"><b>Code</b></td>
                    <td width="180"><b>Course name</b></td>
                    <td width="80" align="center" title="Credits"><b>Credits</b></td>
                    <td width="40" align="center" title="ECTS"><b>ECTS</b></td>
                    <td width="40" align="center" title="Course hour"><b>Hours</b></td>
                    {role === 'Student' && (
                        <>
                        <td width="40" align="center" title="Attendance"><b>Att</b></td>
                        <td width="40" align="center" title="Absent"><b>Abs</b></td>
                        <td width="40" align="center" title="Permission"><b>Per</b></td>
                        <td width="180" align="center" title=""><b>Absence % (Limit: 30%)</b></td>
                        </>
                    )}
                </tr>
                {courses.map(course => (
                <tr key={course.code} className='course-row'>
                    <td className='course-td'>{++count}</td>
                    <td className='course-td'>
                        <span onClick={() => handleCourseClick(course)} className="course-link">{course.code}</span>    
                    </td>
                    <td className='course-td'>{course.name}</td>
                    <td align="center" className='course-td'>{course.credits}</td>
                    <td align="center" className='course-td'>{course.ects}</td>
                    <td align="center" className='course-td'>{course.hours}</td>
                    {role === 'Student' && (
                        <>
                        <td align="center" className='course-td'>{course.attendance}</td>
                        <td align="center" className='course-td'>{course.absence}</td>
                        <td align="center" className='course-td'>{course.permission}</td>
                        <td align="center" className='course-td'>{(course.absence/course.hours)*100|0}%</td>
                        </>
                    )}
                </tr>
                ))}
            </tbody>
        </table>
  );
};

export default TableAtt;
