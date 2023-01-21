// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbumLBe20LhhA8m78lUMPeBnLq09FdIgs",
  authDomain: "video-sharing-app-5afa2.firebaseapp.com",
  projectId: "video-sharing-app-5afa2",
  storageBucket: "video-sharing-app-5afa2.appspot.com",
  messagingSenderId: "744889309963",
  appId: "1:744889309963:web:cc51fda6e0ebc20846a00e",
  measurementId: "G-KB68SC4PKE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
