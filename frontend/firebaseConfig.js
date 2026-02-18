import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB14zSbIPC2q7cMaWZDqYgBKyNGy0_yk-Q",
  authDomain: "flood-risk-visualizer-dc2ab.firebaseapp.com",
  databaseURL: "https://flood-risk-visualizer-dc2ab-default-rtdb.asia-southeast1.firebasedatabase.app", // Adjusted for region if needed, standard fallback
  projectId: "flood-risk-visualizer-dc2ab",
  storageBucket: "flood-risk-visualizer-dc2ab.firebasestorage.app",
  messagingSenderId: "882734225809",
  appId: "1:882734225809:android:dd441790528cad3acb6230"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const db = getFirestore(app);
