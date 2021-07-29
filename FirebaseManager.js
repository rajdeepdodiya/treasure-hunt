import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBXnf0sfSv9fEGLDrj_f_i2CldXD0RtsfU",
    authDomain: "treasure-hunt-a38f9.firebaseapp.com",
    projectId: "treasure-hunt-a38f9",
    storageBucket: "treasure-hunt-a38f9.appspot.com",
    messagingSenderId: "495673798245",
    appId: "1:495673798245:web:9922da9845d1f40de3608c"
  };

  export const db = firebase.initializeApp(firebaseConfig);