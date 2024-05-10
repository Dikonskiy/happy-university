import React from 'react';
import PieChart from "./PieChart";

const CourseDetails = ({ course, lecture, practice }) => {
  const role = localStorage.getItem('userRole');

  switch (role) {
    case 'Student':
      let lecDates = lecture.dates
      let pracDates = practice.dates
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
      return (
        <div className='form-row'>
          <div>
          <h2>Lecture</h2>
          <div id="wrapper">
            <div id="scrollable">
              {lecDates.date.map((date, index) => (
                <div className='form-row'>
                  <p key={index}>{date}</p>
                  <p>{lecDates.status[index]}</p>
                </div>
              ))}
            </div>
          </div>
          </div>
          <div style={{width:"300px", height:"200px"}}>
            <PieChart data = { dataLecture }/>
          </div>
          <div>
          <h2>Practice</h2>
          <div id="wrapper">
            <div id="scrollable">
              {pracDates.date.map((date, index) => (
                <div className='form-row'>
                  <p key={index}>{date}</p>
                  <p>{pracDates.status[index]}</p>
                </div>
              ))} 
            </div>
          </div>
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