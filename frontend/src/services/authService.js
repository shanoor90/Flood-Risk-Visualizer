// services/authService.js - Firebase Authentication Service
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const authService = {
  
  // 🔐 Signup - creates user in Auth + saves profile to Firestore
  signup: async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name in Auth
      await updateProfile(user, { displayName: username });

      // 📦 Save user profile to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        createdAt: serverTimestamp(),
      });

      // 🚪 Sign out immediately to enforce Signup -> Login flow as requested by user
      await signOut(auth);

      return user;
    } catch (error) {
      if (error.code === 'permission-denied' || error.message.includes('permission')) {
        error.message = 'Firestore Security Rules are blocking user profile creation. Please go to your Firebase Console -> Firestore Database -> Rules and allow read/write access for authenticated users.';
      }
      throw error;
    }
  },

  // 🔐 Login
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // 🔐 Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  // Get current logged-in user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen to auth state changes (use in App.js or context)
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};
