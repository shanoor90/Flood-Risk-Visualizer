const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Check if serviceAccountKey.json exists before initializing
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://your-project-id.firebaseio.com" // Optional for Firestore
  });
  console.log("Firebase Admin Initialized Successfully");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error.message);
  console.error("Make sure 'serviceAccountKey.json' is present in the backend/config directory.");
}

const db = admin.firestore();
module.exports = { admin, db };
