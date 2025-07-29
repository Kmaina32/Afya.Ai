import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!firebaseApiKey) {
  throw new Error('NEXT_PUBLIC_FIREBASE_API_KEY is not set. Please add it to your environment variables.');
}

const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: "afyabot-467412.firebaseapp.com",
  projectId: "afyabot-467412",
  storageBucket: "afyabot-467412.appspot.com",
  messagingSenderId: "226086476007",
  appId: "1:226086476007:web:7b12e9393592a03c5bea42",
  measurementId: "G-XXXXXXXXXX"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
