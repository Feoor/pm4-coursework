// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA2TXZ9yeWn_v6LIVke2wwTx3qU8fjzyEE",
    authDomain: "eatly-college-coursework.firebaseapp.com",
    projectId: "eatly-college-coursework",
    storageBucket: "eatly-college-coursework.firebasestorage.app",
    messagingSenderId: "406817582262",
    appId: "1:406817582262:web:bdf418f89d182ee7954a17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Firestore
export const db = getFirestore(app);
export { doc, getDoc, setDoc };

// Firebase Authentication
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged };
auth.languageCode = "ru"; // Установка русского языка для сообщений об ошибках и других уведомлений