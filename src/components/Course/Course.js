import React from 'react';
import { Button } from 'rbx';
import { days, terms, timeParts } from './times';
import { db } from '../../App';

// import firebase from 'firebase/app';
// import 'firebase/database';
// import 'firebase/auth';
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

// const firebaseConfig = {
//   apiKey: "AIzaSyBcd9dqFyNW7sDQ-edjcHhokQrX7Pl27iQ",
//   authDomain: "my-react-app-cs497.firebaseapp.com",
//   databaseURL: "https://my-react-app-cs497.firebaseio.com",
//   projectId: "my-react-app-cs497",
//   storageBucket: "my-react-app-cs497.appspot.com",
//   messagingSenderId: "896458770360  ",
//   appId: "1:896458770360:android:cf64f92a4bde370c6cf14d"
// };

// firebase.initializeApp(firebaseConfig);
// const db = firebase.database().ref();

// const buttonColor = selected => (selected ? 'success' : null);

const getCourseTerm = course => (
	   terms[course.id.charAt(0)]
	 );
const getCourseNumber = course => (
	   course.id.slice(1, 4)
	 );

const daysOverlap = (days1, days2) => ( 
  days.some(day => days1.includes(day) && days2.includes(day))
);

const hoursOverlap = (hours1, hours2) => (
  Math.max(hours1.start, hours2.start)
    < Math.min(hours1.end, hours2.end)
);

const timeConflict = (course1, course2) => (
  daysOverlap(course1.days, course2.days) && hoursOverlap(course1.hours, course2.hours)
);

const courseConflict = (course1, course2) => (
  course1 !== course2
  && getCourseTerm(course1) === getCourseTerm(course2)
  && timeConflict(course1, course2)
);

const hasConflict = (course, selected) => (
  selected.some(selection => course !== selection && courseConflict(course, selection))
);

const buttonColor = selected => (
  selected ? 'success' : null
)
const saveCourse = (course, meets) => {
  db.child('courses').child(course.id).update({meets})
    .catch(error => alert(error));
};

const moveCourse = course => {
  const meets = prompt('Enter new meeting data, in this format:', course.meets);
  if (!meets) return;
  const {days} = timeParts(meets);
  if (days) saveCourse(course, meets); 
  else moveCourse(course);
 };


const Course = ({ course, state, user }) => (
	<Button
		color={buttonColor(state.selected.includes(course))}
		onClick={() => state.toggle(course)}
		onDoubleClick={user ? () => moveCourse(course) : null}
		disabled={hasConflict(course, state.selected)}
	>
		{getCourseTerm(course)} CS {getCourseNumber(course)}: {course.title}
	</Button>
);

export default Course;