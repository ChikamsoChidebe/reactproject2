import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBbO0dAcWXXyv6gJ52ChS9lVIs8tStcZcQ",
  authDomain: "love-eagles-planner-67d3e.firebaseapp.com",
  projectId: "love-eagles-planner-67d3e",
  storageBucket: "love-eagles-planner-67d3e.firebasestorage.app",
  messagingSenderId: "248624976270",
  appId: "1:248624976270:web:9a1b1a7ac28515689cd4df",
  measurementId: "G-XD8LER9NKN"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;