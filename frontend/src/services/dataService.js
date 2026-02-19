// services/dataService.js - Firestore Database Service
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  setDoc,
  doc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";
import { db } from "../firebase";

export const dataService = {

  // ===== SOS ALERTS =====
  
  // 📦 Save SOS Alert to Firestore
  saveSOSAlert: async (sosData) => {
    try {
      const docRef = await addDoc(collection(db, "sos_alerts"), {
        ...sosData,
        timestamp: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // 📦 Get SOS Alerts for a user
  getUserSOSAlerts: async (userId) => {
    try {
      const q = query(
        collection(db, "sos_alerts"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  },

  // ===== FAMILY MEMBERS =====

  // 📦 Add Family Member
  addFamilyMember: async (userId, memberData) => {
    try {
      const docRef = await addDoc(collection(db, `users/${userId}/family`), {
        ...memberData,
        addedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // 📦 Get Family Members
  getFamilyMembers: async (userId) => {
    try {
      const querySnapshot = await getDocs(collection(db, `users/${userId}/family`));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw error;
    }
  },

  // 📦 Delete Family Member
  deleteFamilyMember: async (userId, memberId) => {
    try {
      await deleteDoc(doc(db, `users/${userId}/family`, memberId));
    } catch (error) {
      throw error;
    }
  },

  // ===== USER PROFILE =====

  // 📦 Get User Profile from Firestore
  getUserProfile: async (userId) => {
    try {
      const docSnap = await getDoc(doc(db, "users", userId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // 📦 Update User Profile
  updateUserProfile: async (userId, data) => {
    try {
      await setDoc(doc(db, "users", userId), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      throw error;
    }
  },

  // ===== LOCATION TRACKING =====

  // 📦 Save Location to Firestore
  saveLocation: async (userId, locationData) => {
    try {
      const docRef = await addDoc(collection(db, `users/${userId}/locations`), {
        ...locationData,
        timestamp: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }
};
