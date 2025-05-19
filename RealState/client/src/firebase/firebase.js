// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  apiKey: "AIzaSyB5Z5pgoevSWEq1CPleCS2I_Pb2xCcEsdA",
  authDomain: "realstate-65325.firebaseapp.com",
  projectId: "realstate-65325",
  storageBucket: "realstate-65325.firebasestorage.app",
  messagingSenderId: "1063309453561",
  appId: "1:1063309453561:web:3f92c2308226b23e459a28",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
