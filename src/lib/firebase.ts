import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB7Kg9cWw5ryaOayB-EpO89exgGtillsDc",
  authDomain: "afyabot-467412.firebaseapp.com",
  projectId: "afyabot-467412",
  storageBucket: "afyabot-467412.appspot.com",
  messagingSenderId: "226086476007",
  appId: "1:226086476007:web:7b12e9393592a03c5bea42",
  measurementId: ""
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a time.
      console.warn('Firestore persistence failed: multiple tabs open.');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.warn('Firestore persistence not available in this browser.');
    }
  });


export { app, auth, db };
