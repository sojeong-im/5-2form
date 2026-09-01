import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDfzt2oJ1dzu-Ee7bW5o3rFpFlfjcANPFo",
  authDomain: "eatseoul-54f9e.firebaseapp.com",
  projectId: "eatseoul-54f9e",
  storageBucket: "eatseoul-54f9e.firebasestorage.app",
  messagingSenderId: "151803793406",
  appId: "1:151803793406:web:e4006717e6c05c7a0dbaaf",
  measurementId: "G-GXHQ9TWK0H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only runs in browser environments)
export let analytics: any;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore
export const db = getFirestore(app);
