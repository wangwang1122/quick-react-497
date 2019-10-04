import React, { useState, useEffect} from 'react';

import "rbx/index.css";
import { Button, Container, Message, Title } from "rbx";
import {  timeParts } from './components/Course/times';
import CourseList from './components/CourseList.js';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const firebaseConfig = {
  apiKey: "AIzaSyBcd9dqFyNW7sDQ-edjcHhokQrX7Pl27iQ",
  authDomain: "my-react-app-cs497.firebaseapp.com",
  databaseURL: "https://my-react-app-cs497.firebaseio.com",
  projectId: "my-react-app-cs497",
  storageBucket: "my-react-app-cs497.appspot.com",
  messagingSenderId: "896458770360  ",
  appId: "1:896458770360:android:cf64f92a4bde370c6cf14d"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.database().ref();

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const Welcome = ({ user }) => (
  <Message color="info">
    <Message.Header>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
    </Message.Header>
  </Message>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);


const Banner = ({ user, title }) => (
  <React.Fragment>
    { user ? <Welcome user={ user } /> : <SignIn /> }
    <Title>{ title || '[loading...]' }</Title>
  </React.Fragment>
);




const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: Object.values(schedule.courses).map(addCourseTimes)
});

const App = () => {
  const [schedule, setSchedule] = useState({ title: '', courses: [] });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setSchedule(addScheduleTimes(snap.val()));
    };
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

return (
    <Container>
      <Banner title={ schedule.title } user={ user } />
      <CourseList courses={ schedule.courses } user={ user } />
    </Container>
  );
};
export default App;