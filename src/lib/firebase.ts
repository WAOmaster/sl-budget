// Firebase Client Configuration for SL Budget
// This config is for client-side Firestore access

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'budget-buddy-1e3e8',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
function getFirebaseApp(): FirebaseApp {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0];
}

// Create singleton instances
const firebaseApp = getFirebaseApp();
const firestore = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

// Connect to emulators in development (only once)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
  try {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
    connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
  } catch (e) {
    // Emulators already connected
  }
}

// Export instances
export { firebaseApp, firestore, firebaseAuth };
export const db = firestore; // Alias for backward compatibility

// Collection names
export const COLLECTIONS = {
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  BILLS: 'bills',
  BUDGETS: 'budgets',
  USERS: 'users',
  INSIGHTS: 'ai_insights',
  UPLOADS: 'upload_history',
  SAVINGS_GOALS: 'savings_goals',
} as const;

// Default user ID for development (replace with auth user ID in production)
export const DEFAULT_USER_ID = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'default_user';
