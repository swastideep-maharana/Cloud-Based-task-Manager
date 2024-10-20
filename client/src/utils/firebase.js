// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "task-manager-1266c.firebaseapp.com",
  projectId: "task-manager-1266c",
  storageBucket: "task-manager-1266c.appspot.com",
  messagingSenderId: "762197449048",
  appId: "1:762197449048:web:40a0d215b0d35368046d2d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
