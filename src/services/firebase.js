// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your own Firebase config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCwMg1I3d5QHGxRI4ih7vPhHArez3717No",
  authDomain: "reclaim-it-7997e.firebaseapp.com",
  projectId: "reclaim-it-7997e",
  storageBucket: "reclaim-it-7997e.firebasestorage.app",
  messagingSenderId: "396560313999",
  appId: "1:396560313999:web:2c49256b738c54ae7d8afa",
  measurementId: "G-F3HN6DC6QB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in the app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
