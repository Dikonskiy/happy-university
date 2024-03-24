import React, { useState } from 'react';
import PieChart from "./PieChart";

const CourseDetails = ({ course, onReturn }) => {
  const role = localStorage.getItem('userRole');

  switch (role) {
    case 'Student':
      return (
        <div>
          <div className='App'>
            <PieChart course = {course}/>
          </div>
          <p>Course Code: {course.code}</p>
          <p>Course Name: {course.name}</p>
          <button onClick={onReturn}>Back</button>
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
          <button onClick={onReturn}>Back</button>
        </>
    )
    default:
      return (
        <div>
          <p>Course Code: {course.code}</p>
          <p>Course Name: {course.name}</p>
          <button onClick={onReturn}>Back</button>
        </div>
      )
  }
};

export default CourseDetails;