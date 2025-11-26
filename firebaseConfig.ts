// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAKy-u0t-tUp7RH4ioVuspVv9o954_3Ccs",
  authDomain: "smm-panel-ce5f1.firebaseapp.com",
  projectId: "smm-panel-ce5f1",
  storageBucket: "smm-panel-ce5f1.firebasestorage.app",
  messagingSenderId: "247198801380",
  appId: "1:247198801380:web:ea8632e56dcf0bac22fbf1",
  measurementId: "G-FQ1WPXEMSF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
const auth = getAuth(app);

// Firestore DB
const db = getFirestore(app);

// Export
export { auth, db }; // named exports
export default app;   // default export for FirebaseApp if needed   