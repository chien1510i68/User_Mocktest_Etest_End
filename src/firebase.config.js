// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmClqkzY2PQwrE170foNrE0OJvepn79gY",
  authDomain: "etestuser-4ec97.firebaseapp.com",
  projectId: "etestuser-4ec97",
  storageBucket: "etestuser-4ec97.appspot.com",
  messagingSenderId: "528781899826",
  appId: "1:528781899826:web:0fdb985649dea911a9a42b",
  measurementId: "G-NETZ8V0ZRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);