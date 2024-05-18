import { encode } from 'js-base64';
import { jwtDecode } from 'jwt-decode';
import { Course } from './Models.js';

const JWT_EXP_BUFFER_MINUTES = 2; // buffer time in minutes before the token expires

// utils.js

export const checkToken = async (accessToken, refreshToken) => {
  const data = {
    refresh_token: refreshToken
  };
  
  if (typeof accessToken !== 'string' || accessToken === 'undefined') {
    localStorage.clear();
    window.location.href = '/sign';
  }

  const decodedAccessToken = jwtDecode(accessToken)
  const jwtExpirationTime = decodedAccessToken.exp * 1000; // Convert the expiration time to milliseconds
  const currentTime = Date.now();

  if (jwtExpirationTime - currentTime > JWT_EXP_BUFFER_MINUTES * 60 * 1000) {
    return accessToken;
  }

  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://206.189.60.189:3000');
  try{
    const response = await fetch('http://206.189.60.189:8080/refresh-token', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const data = await response.json();
      if (data && data.access_token){
        return data.access_token;
      } else {
        throw new Error("Invalid data");
      }
    } 
    else if (response.statusCode === 401){
      localStorage.clear();
      window.location.href = '/sign';
    } 
    else {
      throw new Error("Failed to refresh access token");
    }
  } catch (error){
    console.error(error);
    return accessToken;
  }
}

export const authorization = (id, password) => {
  const data = {
    card_id: id,
    password: password
  };
  let headers = new Headers();

  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Authorization', 'Basic ' + encode(id + ":" +  password));
  headers.append('Origin','http://206.189.60.189:3000');

  return fetch('http://206.189.60.189:8080/login', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
};

export const registration = (name, email, role, password, pincode) => {
  const data = {
    name: name,
    email: email,
    role: role,
    password: password,
    pin_code: pincode
  };
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://206.189.60.189:3000');

  return fetch('http://206.189.60.189:8080/register', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
}

export const afterRegistration = (card_id, birth_date, image) => {
  const data = {
    card_id: card_id,
    birthday: birth_date,
    image: image
  };
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://206.189.60.189:3000');

  return fetch('http://206.189.60.189:8080/after-reg', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const getImage = (card_id) => {
  const data = {
    card_id: card_id
  };

  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://206.189.60.189:3000');
  headers.append('Authorization', 'Bearer'+ localStorage.getItem('accessToken'));

  return fetch('http://206.189.60.189:8080/get-image', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const getBirthDate = (card_id) => {
  const data = {
    card_id: card_id
  };

  let headers = new Headers();
  headers.append('Content-Type', 'application/json'); 
  headers.append('Accept', 'application/json'); 
  headers.append('Origin','http://206.189.60.189:3000'); 
  headers.append('Authorization', 'Bearer'+ localStorage.getItem('accessToken'));
  
  return fetch('http://206.189.60.189:8080/get-birthday', { 
    method: 'POST', 
    headers: headers, 
    body: JSON.stringify(data), 
  })  
}

export const checkPinCode = (card_id, pin_code) => {
  const data = {
    card_id: card_id, 
    pin_code: parseInt(pin_code)
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://206.189.60.189:3000');

  return fetch('http://206.189.60.189:8080/check-pincode', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const updatePassword = (card_id, new_password) => {
  const data = {
    card_id: card_id,
    password: new_password
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://206.189.60.189:3000');

  return fetch('http://206.189.60.189:8080/update-password', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const takeUserData = () => {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://206.189.60.189:3000');
  headers.append('Access-Control-Allow-Origin', 'http://206.189.60.189:3000');
  headers.append('Authorization', 'Bearer' + localStorage.getItem('accessToken'))

  return fetch('http://206.189.60.189:8080/get-user-data', {
    method: 'GET',
    headers: headers,
  })
}

export const getCourses = () => {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://206.189.60.189:3000');
  headers.append('Authorization', 'Bearer'+ localStorage.getItem('accessToken'))

  return fetch('http://206.189.60.189:8080/get-courses', {
    method: 'GET',
    headers: headers,
  })
}

export const getCourseInfo = async () => {
  const role = localStorage.getItem('userRole');
  var courses = [];
  var lectures = [];
  var practices = [];
  await getCourses()
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch courses");
          }
        })
        .then( async (data) => {
          if (data.length !== 0) {
            for (let i = 0; i < data.length; i++) {
              const course = new Course(data[i].course_code, data[i].course_name, "2+1", "5", 45);
              if(role === "Student"){
                let lecture = await getStudentCourse(course, "N")
                let practice = await getStudentCourse(course, "P")
                course.setAttendance(lecture.attendance + practice.attendance);
                course.setAbsence(lecture.absence + practice.absence);
                course.setPermission(lecture.permission + practice.permission);
                course.setManual(lecture.manual + practice.manual);

                lectures.push(lecture);
                practices.push(practice);
                courses.push(course);
              }
              if(role === "Teacher"){
                lectures.push(course);
                practices.push(course);
                courses.push(course);
              }
            }
          } else {
            throw new Error("No courses found");
          }
        })
        .catch((error) => {
          console.error(error);
        });

        return {courses, lectures, practices};
}

async function getStudentCourse (course, type)  {

    // var newCourseData = null;
  try{
    const res = await getStatus(course.code, type)
    if (res.ok) {
      const data = await res.json();
      if (data){
        var attend=0
        var absent=0
        var permited=0
        var manual=0
        var dates = {
          date: [],
          status: []
        }
        if (data.length !== 0) {
          for (let i = 0; i < data.length; i++) {
            dates.date.push(data[i].date)
            dates.status.push(data[i].status)
            if (data[i].status === "attend"){
                attend+=1
            } else if (data[i].status === "absent"){
                absent+=1
            } else if (data[i].status === "permitted"){
                permited+=1
            } else if (data[i].status === "manual"){
                manual+=1
            }
          }
          return new Course(course.code, course.name, course.credits, course.ects, type === "N" ? 30 : 15, attend, absent, permited, manual, dates);
        } 
        else {
          throw new Error("No courses found");
        }
      }else{
        throw new Error("No courses found");
      }

    } else {
      throw new Error("Failed to fetch courses");
    }
  }catch(error){
    console.error(error);
    return course;
  }
}

export const generateCode = (course_code) => {
  const data = {
    course_code: course_code
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://206.189.60.189:3000');
  headers.append('Authorization', 'Bearer'+ localStorage.getItem('accessToken'))

  return fetch('http://206.189.60.189:8080/generate-code', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const takeAttendance = (generateCode, course) => {
  const data = {
    generated_code: generateCode,
    room: "",
    course: course
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://206.189.60.189:3000');
  headers.append('Authorization', 'Bearer'+ localStorage.getItem('accessToken'))

  return fetch('http://206.189.60.189:8080/card-entry-in', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}

export const getStatus = (course_code, course_type) => {
  const data = {
    course_code: course_code,
    course_type: course_type
  }
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  headers.append('Origin','http://206.189.60.189:3000');
  headers.append('Authorization', 'Bearer'+ localStorage.getItem('accessToken'))

  return fetch('http://206.189.60.189:8080/get-status', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  })
}