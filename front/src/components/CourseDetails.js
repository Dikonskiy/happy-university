import React from 'react';
import PieChart from "./PieChart";

const CourseDetails = ({ course }) => {
  const role = localStorage.getItem('userRole');

  let hour = course.hours - course.attendance - course.absence - course.permission
  const data = {
    labels: [
      'Attendance',
      'Absence',
      'Permission',
      'Not submitted'
    ],
    datasets: [{
      label: 'Hours',
      data: [course.attendance, course.absence, course.permission, hour],
      backgroundColor: [
        'rgb(0, 128, 0)',
        'rgb(255, 0, 0)',
        'rgb(255, 205, 86)',
        'rgb(128, 128, 128)'
      ],
      hoverOffset: 8
    }]
  };

  switch (role) {
    case 'Student':
      return (
        <div className='form-row'>
          <div>
            <p>Space for course details</p>
          </div>
          <div style={{width:"300px", height:"200px"}}>
            <PieChart data = { data }/>
          </div>
        </div>
      )
    case 'Teacher':
      return (
        <>
          <p>Course Code: {course.code}</p>
          <p>Course Name: {course.name}</p>
          <table className='course-table'>
            <thead>
              
            </thead>
            <tbody>

            </tbody>
          </table>
        </>
    )
    default:
      return (
        <div>
          <p>Course Code: {course.code}</p>
          <p>Course Name: {course.name}</p>
        </div>
      )
  }
};

export default CourseDetails;