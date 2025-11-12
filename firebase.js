// firebase.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBSDgGm7vsdhQttS7Bf7CT67rO3aReNfrQ",
  authDomain: "auth--bonus.firebaseapp.com",
  projectId: "auth--bonus",
  storageBucket: "auth--bonus.firebasestorage.app",
  messagingSenderId: "371239354755",
  appId: "1:371239354755:web:663e5815cd376c0320f6b6"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
