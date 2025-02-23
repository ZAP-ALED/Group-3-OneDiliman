// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqt6xlWws2ki5QVYXsPOy44huf6Yyj39U",
  authDomain: "onediliman-f7a97.firebaseapp.com",
  projectId: "onediliman-f7a97",
  storageBucket: "onediliman-f7a97.firebasestorage.app",
  messagingSenderId: "1066337033892",
  appId: "1:1066337033892:web:9c80c42fd3f902d498d031",
  measurementId: "G-26TH2NTBSV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };