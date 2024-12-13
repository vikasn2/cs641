// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"; // Import Storage

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBimKKlKxOZGFBvTdLx6khdtQ7VBGWF5I0",
  authDomain: "meetupmaven-6c65e.firebaseapp.com",
  projectId: "meetupmaven-6c65e",
  storageBucket: "meetupmaven-6c65e.firebasestorage.app",
  messagingSenderId: "837857488606",
  appId: "1:837857488606:web:670891a78453ee9bd69c4f",
  measurementId: "G-S79RF7XGYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage = getStorage(app); // Export Storage instance

export default app