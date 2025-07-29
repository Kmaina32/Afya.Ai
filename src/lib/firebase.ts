import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// IMPORTANT: Replace "YOUR_API_KEY_HERE" with your actual Firebase Web API Key.
const firebaseApiKey = "YOUR_API_KEY_HERE";

if (!firebaseApiKey || firebaseApiKey === "YOUR_API_KEY_HERE") {
  console.error('Firebase API Key is not set in src/lib/firebase.ts. Please replace "YOUR_API_KEY_HERE" with your actual key.');
  // We don't throw an error here to allow the app to build, but Firebase will not work.
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
