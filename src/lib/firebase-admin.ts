// Firebase Admin SDK for Server-Side API Routes
// Uses lazy initialization to avoid build-time errors

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Cached instances
let _adminApp: App | null = null;
let _adminDb: Firestore | null = null;

// Lazy getter for admin app - only initializes when called at runtime
export function getAdminApp(): App {
  if (_adminApp) {
    return _adminApp;
  }
  
  if (getApps().length > 0) {
    _adminApp = getApps()[0];
    return _adminApp;
  }

  // Parse service account from env at runtime
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountKey);
  } catch (e) {
    throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY as JSON');
  }

  _adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || 'budget-buddy-1e3e8',
  });

  return _adminApp;
}

// Lazy getter for Firestore instance
export function getAdminDb(): Firestore {
  if (_adminDb) {
    return _adminDb;
  }
  _adminDb = getFirestore(getAdminApp());
  return _adminDb;
}

// Collection names (same as client)
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

// Default user ID
export const DEFAULT_USER_ID = process.env.NEXT_PUBLIC_DEFAULT_USER_ID || 'default_user';
