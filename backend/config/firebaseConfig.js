const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

let db;

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin Initialized Successfully");
    db = admin.firestore();
  } else {
    console.warn("⚠️ WARNING: 'serviceAccountKey.json' not found in backend/config.");
    console.warn("⚠️ Local development will continue without Firestore connectivity.");
    console.warn("⚠️ Please ask the project lead for the credentials file.");
    
    // Provide a mock db or handle null in controllers
    db = null; 
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error.message);
  db = null;
}

module.exports = { admin, db };
