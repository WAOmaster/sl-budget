// Firebase Admin SDK for Server-Side API Routes
// This uses service account credentials for secure server-side access

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Get or create admin app
function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Initialize with service account credentials from env
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : {
        projectId: process.env.FIREBASE_PROJECT_ID || 'budget-buddy-1e3e8',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

  return initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.projectId || 'budget-buddy-1e3e8',
  });
}

// Export admin Firestore instance
export const adminApp = getAdminApp();
export const adminDb = getFirestore(adminApp);

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
