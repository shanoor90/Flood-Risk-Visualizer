import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADQPuW3n7VpxI6jcMyMMj3QPQha8nhVKg",
  authDomain: "flood-c256c.firebaseapp.com",
  projectId: "flood-c256c",
  storageBucket: "flood-c256c.firebasestorage.app",
  messagingSenderId: "104158434227",
  appId: "1:104158434227:web:25fd3d21a812042f21b1c6",
  measurementId: "G-1LEW8994BW"
};

async function check() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  try {
    const testRef = doc(db, '_connection_test', 'ping_node');
    await setDoc(testRef, { status: 'ok', time: serverTimestamp() });
    const snap = await getDoc(testRef);
    if(snap.exists()) {
      console.log('SUCCESS');
    } else {
      console.log('FAILED');
    }
  } catch(e) {
    console.error('ERROR', e.message);
  }
  process.exit(0);
}
check();
