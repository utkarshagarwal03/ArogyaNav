import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// =========================================================================
// 🔥 FIREBASE CONFIGURATION 🔥
// Replace the entire firebaseConfig object below with the one from your 
// Firebase Console (Project Settings -> Web App).
// =========================================================================

const firebaseConfig = {
  apiKey: "AIzaSyBfQ76MAPVvWPwUxQk0uyVBSYjU21tE-6s",
  authDomain: "arogyanav-db.firebaseapp.com",
  projectId: "arogyanav-db",
  storageBucket: "arogyanav-db.firebasestorage.app",
  messagingSenderId: "2374170774",
  appId: "1:2374170774:web:38d2daa36bbd52af056ab7"
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

