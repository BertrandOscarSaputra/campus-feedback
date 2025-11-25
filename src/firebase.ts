// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5It2oO0u5MlwBVYDXD3Tk59op8_qU-3U",
  authDomain: "frontend-ce7fd.firebaseapp.com",
  projectId: "frontend-ce7fd",
  storageBucket: "frontend-ce7fd.firebasestorage.app",
  messagingSenderId: "379804249007",
  appId: "1:379804249007:web:a65e903a9bd4a7bde75d5a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
