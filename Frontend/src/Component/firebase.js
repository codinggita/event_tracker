// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzFgD5VvwjTvjbL1p9q2agpcfEKlibqRM",
  authDomain: "user-auth-9f6d8.firebaseapp.com",
  projectId: "user-auth-9f6d8",
  storageBucket: "user-auth-9f6d8.firebasestorage.app",
  messagingSenderId: "529533207048",
  appId: "1:529533207048:web:e17467825ed28d1d1547bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;

