// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLY0a2e0VAy3z7dWCFL5iTY8NwKiSJisQ",
  authDomain: "test-auth-88dac.firebaseapp.com",
  projectId: "test-auth-88dac",
  storageBucket: "test-auth-88dac.appspot.com",
  messagingSenderId: "620147320395",
  appId: "1:620147320395:web:fb33f8196c5707ade94fce",
  measurementId: "G-4TMJZQB315"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);