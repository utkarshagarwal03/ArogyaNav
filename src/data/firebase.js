import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// =========================================================================
// 🔥 FIREBASE CONFIGURATION 🔥
// Replace the entire firebaseConfig object below with the one from your 
// Firebase Console (Project Settings -> Web App).
// =========================================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// =========================================================================

let app = null;
let db = null;

// Only initialize if the user has actually pasted their config
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "PASTE_YOUR_API_KEY_HERE") {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("🔥 Firebase initialized successfully!");
  } catch (error) {
    console.error("🔥 Firebase initialization error:", error);
  }
}

export { db };

