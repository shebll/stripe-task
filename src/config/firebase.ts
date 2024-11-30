import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDseSpx5tJ1mpF0S0vFV2dV-S9kWtI2jb8",
  authDomain: "patientchat-3d4ee.firebaseapp.com",
  projectId: "patientchat-3d4ee",
  storageBucket: "patientchat-3d4ee.firebasestorage.app",
  messagingSenderId: "703134724815",
  appId: "1:703134724815:web:217efa7b689b8c1a807dba",
  measurementId: "G-FRPKX9388C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);