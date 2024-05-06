import React, { useEffect, useState } from 'react';
import { checkToken, getStatus } from './fetches';
import { Course } from './Models';

const TableAtt = ({ courses, handleCourseClick }) => {
    const [loading, setLoading] = useState(true);
    const [lecture, setLecture] = useState([])
    let count = 0;
    
    const role = localStorage.getItem('userRole');

    useEffect(() => {
        const checkAccessToken = async () => {
            const newAccessToken = await checkToken(localStorage.getItem("accessToken"), localStorage.getItem("refreshToken"));
            localStorage.setItem("accessToken", newAccessToken);
            await fetchInfo();
          };
        const fetchInfo = async () => {
            if (courses && courses.length !== 0){
                for (let i=0; i<courses.length; i++) {
                    getStatus(courses[i].code, "N")
                    .then((response) => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            throw new Error("Failed to fetch courses");
                        }
                    })
                    .then((data) => {
                            var newCourseData = []
                            var attend=0
                            var absent=0
                            var permited=0
                            var manual=0
                            if (data.length !== 0) {
                                for (let i = 0; i < data.length; i++) {
                                if (data[i].status === "attend"){
                                    attend+=1
                                } else if (data[i].status === "absent"){
                                    absent+=1
                                } else if (data[i].status === "permited"){
                                    permited+=1
                                } else if (data[i].status === "manual"){
                                    manual+=1
                                }
                                }
                                newCourseData.push(new Course(courses[i].code, courses[i].name, courses[i].credits, courses[i].ects, courses[i].hours, attend, absent, permited, manual))
                                setLecture(newCourseData)
                            } else {
                                throw new Error("No courses found");
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            }else{
                console.log('No courses found')
            }
            setLoading(false);
        }
        checkAccessToken();
    }, [courses])

    if (loading) {
        return <div className="loader"></div>;
    }
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
                {lecture.map(course => (
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
