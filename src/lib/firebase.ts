import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB7Kg9cWw5ryaOayB-EpO89exgGtillsDc",
  authDomain: "afyabot-b2wf1.firebaseapp.com",
  projectId: "afyabot-b2wf1",
  storageBucket: "afyabot-b2wf1.firebasestorage.app",
  messagingSenderId: "226086476007",
  appId: "1:226086476007:web:7b12e9393592a03c5bea42",
  measurementId: ""
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
