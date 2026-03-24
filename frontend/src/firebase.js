// src/firebase.js - Main Firebase initialization file
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyADQPuW3n7VpxI6jcMyMMj3QPQha8nhVKg",
  authDomain: "flood-c256c.firebaseapp.com",
  projectId: "flood-c256c",
  storageBucket: "flood-c256c.firebasestorage.app",
  messagingSenderId: "104158434227",
  appId: "1:104158434227:web:25fd3d21a812042f21b1c6",
  measurementId: "G-1LEW8994BW"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// 🔐 Authentication with Persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// 📦 Firestore Database
export const db = getFirestore(app);

// ☁️ Storage
export const storage = getStorage(app);

export default app;
