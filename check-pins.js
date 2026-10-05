import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBfQ76MAPVvWPwUxQk0uyVBSYjU21tE-6s",
  authDomain: "arogyanav-db.firebaseapp.com",
  projectId: "arogyanav-db",
  storageBucket: "arogyanav-db.firebasestorage.app",
  messagingSenderId: "2374170774",
  appId: "1:2374170774:web:38d2daa36bbd52af056ab7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkPins() {
  const docRef = doc(db, 'global', 'hospitals');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log(JSON.stringify(data.roles, null, 2));
  } else {
    console.log("No custom hospitals found.");
  }
  process.exit(0);
}

checkPins();
