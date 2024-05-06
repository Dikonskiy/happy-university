import React from 'react';
import PieChart from "./PieChart";

const CourseDetails = ({ course, lecture, practice }) => {
  const role = localStorage.getItem('userRole');
  let hour = course.hours - course.attendance - course.absence - course.permission - course.manual;
  const data = {
    labels: [
      'Attendance',
      'Absence',
      'Permission',
      'Manual',
      'Not Submitted'
    ],
    datasets: [{
      label: 'Hours',
      data: [course.attendance, course.absence, course.permission, course.manual, hour],
      backgroundColor: [
        'rgb(0, 128, 0)',
        'rgb(255, 0, 0)',
        'rgb(255, 205, 86)',
        'rgb(128, 255, 128)',
        'rgb(128, 128, 128)'
      ],
      hoverOffset: 8
    }]
  };

  let hourLec = lecture.hours - lecture.attendance - lecture.absence - lecture.permission - lecture.manual
  const dataLecture = {
    labels: [
      'Attendance',
      'Absence',
      'Permission',
      'Manual',
      'Not Submitted'
    ],
    datasets: [{
      label: 'Hours',
      data: [course.attendance, course.absence, course.permission, course.manual, hourLec],
      backgroundColor: [
        'rgb(0, 128, 0)',
        'rgb(255, 0, 0)',
        'rgb(255, 205, 86)',
        'rgb(128, 255, 128)',
        'rgb(128, 128, 128)'
      ],
      hoverOffset: 8
    }]
  };

  let hourPrac = practice.hours - practice.attendance - practice.absence - practice.permission - practice.manual
  const dataPractice = {
    labels: [
      'Attendance',
      'Absence',
      'Permission',
      'Manual',
      'Not Submitted'
    ],
    datasets: [{
      label: 'Hours',
      data: [course.attendance, course.absence, course.permission, course.manual, hourPrac],
      backgroundColor: [
        'rgb(0, 128, 0)',
        'rgb(255, 0, 0)',
        'rgb(255, 205, 86)',
        'rgb(128, 255, 128)',
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
            <p>Lecture</p>
            <p>Course Name: {course.name}</p>
          </div>
          <div style={{width:"300px", height:"200px"}}>
            <PieChart data = { dataLecture }/>
          </div>
          <div>
            <p>Practice</p>
            <p>Course Name: {course.name}</p>
          </div>
          <div style={{width:"300px", height:"200px"}}>
            <PieChart data = { dataPractice }/>
          </div>
        </div>
      )
    case 'Teacher':
      return (
        <>
          <p>Course Code: {course.code}</p>
          <p>Course Name: {course.name}</p>
          {/* <table className='course-table'>
            <thead>
              
            </thead>
            <tbody>

            </tbody>
          </table> */}
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