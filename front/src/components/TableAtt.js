import React from 'react';


const TableAtt = ({ courses, handleCourseClick }) => {
    let count = 0;
    
    const role = localStorage.getItem('userRole');

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
                    {role === 'Student' && (
                        <>
                        <td width="30" align="center" title="Attendance"><img width="20" height="20" src='https://cdn-icons-png.flaticon.com/512/4315/4315445.png' alt='attendance'/></td>
                        <td width="30" align="center" title="Absent"><img width="20" height="20" src='https://cdn-icons-png.flaticon.com/512/11379/11379029.png' alt='absent'/></td>
                        <td width="30" align="center" title="Permission"><img width="20" height="20" src='https://cdn-icons-png.flaticon.com/512/3665/3665921.png' alt='permission'/></td>
                        <td width="30" align="center" title="Manual"><img width="20" height="20" src='https://cdn-icons-png.flaticon.com/512/11925/11925217.png' alt='manual'/></td>
                        <td width="160" align="center" title=""><b>Absence % <br/>(Limit: 30%)</b></td>
                        </>
                    )}
                </tr>
                {courses.map((course, index) => (
                <tr key={index} className='course-row'>
                    <td className='course-td'>{++count}</td>
                    <td className='course-td'>
                        <span onClick={() => handleCourseClick(course, index)} className="course-link">{course.code}</span>    
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
                        <td align="center" className='course-td'>{course.manual}</td>
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
