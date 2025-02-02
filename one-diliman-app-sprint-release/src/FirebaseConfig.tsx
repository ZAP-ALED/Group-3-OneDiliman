// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
/*const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};*/
const firebaseConfig = {
    apiKey: "AIzaSyA4Pu2BZZl2VESsGEophz8-LCPrWF6KaPY",
    authDomain: "ugnayan-app.firebaseapp.com",
    projectId: "ugnayan-app",
    storageBucket: "ugnayan-app.appspot.com",
    messagingSenderId: "24966811972",
    appId: "1:24966811972:web:143706756832cc45d04711",
    measurementId: "G-084FXPRDZG"
};  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export { app, auth }