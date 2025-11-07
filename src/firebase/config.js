import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCCKoRI9cbE75Dq9j6M9bhqAkiMmGBbX9w",
  authDomain: "hotel-saas-b84a8.firebaseapp.com",
  databaseURL: "https://hotel-saas-b84a8-default-rtdb.firebaseio.com",
  projectId: "hotel-saas-b84a8",
  storageBucket: "hotel-saas-b84a8.firebasestorage.app",
  messagingSenderId: "131976801076",
  appId: "1:131976801076:web:7d2fac76be2427d620d361",
  measurementId: "G-HELLT14RE4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);