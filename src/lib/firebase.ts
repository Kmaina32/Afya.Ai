import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    "projectId": "afyabot-b2wf1",
    "appId": "1:226086476007:web:7b12e9393592a03c5bea42",
    "storageBucket": "afyabot-b2wf1.firebasestorage.app",
    "apiKey": "AIzaSyB7Kg9cWw5ryaOayB-EpO89exgGtillsDc",
    "authDomain": "afyabot-b2wf1.firebaseapp.com",
    "messagingSenderId": "226086476007"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = (typeof window !== 'undefined') ? getMessaging(app) : null;


export { app, auth, db, messaging };
