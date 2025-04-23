// firebase.ts

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";

// Firebase config ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyBMpmHNXn8ePfZT04jKMLbbcYfVvr0rxbE",
  authDomain: "chaitang-app.firebaseapp.com",
  projectId: "chaitang-app",
  storageBucket: "chaitang-app.appspot.com",
  messagingSenderId: "736335018579",
  appId: "1:736335018579:web:a02787b9ca71f6392b24a6",
  measurementId: "G-MMV15DNYS8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ส่งออกไปใช้ในไฟล์อื่น
export { auth, signInWithCredential, GoogleAuthProvider };
