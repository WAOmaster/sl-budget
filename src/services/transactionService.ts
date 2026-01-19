// Transaction Service - CRUD operations for transactions
// Connects to existing Firestore transactions collection from SMS webhook

import {
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
  DocumentData,
  startAfter,
  getCountFromServer,
} from 'firebase/firestore';
import { firestore, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase';
import type { Transaction, TransactionInput, TransactionFilters, TransactionStats } from '@/types';

// Helper to safely convert Firestore timestamps to JavaScript Dates
function toDate(timestamp: any): Date {
  if (!timestamp) {
    return new Date();
  }
  
  // If already a Date
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // If it has toDate method (Firestore Timestamp)
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    try {
      return timestamp.toDate();
    } catch (error) {
      // Continue to fallback methods
    }
  }
  
  // If it has _seconds property (serialized Firestore Timestamp)
  if (timestamp._seconds !== undefined) {
    return new Date(timestamp._seconds * 1000);
  }
  
  // If it has seconds property (alternative format)
  if (timestamp.seconds !== undefined) {
    return new Date(timestamp.seconds * 1000);
  }
  
  // Try to parse as date string or number
  try {
    const parsed = new Date(timestamp);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  } catch (error) {
    // Fall through to default
  }
  
  // Last resort: current date
  return new Date();
}

// Convert Firestore document to Transaction type
function docToTransaction(doc: DocumentData): Transaction {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId || DEFAULT_USER_ID,
    source: data.source || 'manual',
    type: data.type || 'expense',
    amount: Number(data.amount) || 0,
    currency: data.currency || 'LKR',
    category: data.category || 'uncategorized',
    categoryId: data.categoryId,
    merchant: data.merchant,
    description: data.description,
    notes: data.notes,
    bank: data.bank,
    cardLast4: data.cardLast4,
    balance: data.balance,
    rawMessage: data.rawMessage,
    simNumber: data.simNumber,
    needsReview: data.needsReview || false,
    isRecurring: data.isRecurring || false,
    tags: data.tags || [],
    timestamp: toDate(data.timestamp),
    createdAt: toDate(data.createdAt),
    updatedAt: data.updatedAt ? toDate(data.updatedAt) : null,
  };
}

// Get transactions with filters
export async function getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const constraints: QueryConstraint[] = [];
  
  // Build query constraints
  if (filters.userId) {
    constraints.push(where('userId', '==', filters.userId));
  }
  if (filters.type) {
    constraints.push(where('type', '==', filters.type));
  }
  if (filters.category) {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters.source) {
    constraints.push(where('source', '==', filters.source));
  }
  if (filters.needsReview !== undefined) {
    constraints.push(where('needsReview', '==', filters.needsReview));
  }
  if (filters.startDate) {
    constraints.push(where('timestamp', '>=', Timestamp.fromDate(filters.startDate)));
  }
  if (filters.endDate) {
    constraints.push(where('timestamp', '<=', Timestamp.fromDate(filters.endDate)));
  }
  
  // Order by timestamp descending
  constraints.push(orderBy('timestamp', 'desc'));
  
  // Apply limit if specified
  if (filters.limit) {
    constraints.push(limit(filters.limit));
  }
  
  const q = query(collection(firestore, COLLECTIONS.TRANSACTIONS), ...constraints);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(docToTransaction);
}

// Get a single transaction by ID
export async function getTransaction(id: string): Promise<Transaction | null> {
  const docRef = doc(firestore, COLLECTIONS.TRANSACTIONS, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return docToTransaction(docSnap);
}

// Add a new transaction
export async function addTransaction(input: TransactionInput): Promise<string> {
  const docRef = await addDoc(collection(firestore, COLLECTIONS.TRANSACTIONS), {
    userId: DEFAULT_USER_ID,
    source: 'manual',
    type: input.type,
    amount: input.amount,
    currency: input.currency || 'LKR',
    category: input.category,
    merchant: input.merchant,
    description: input.description,
    notes: input.notes,
    timestamp: input.timestamp ? Timestamp.fromDate(input.timestamp) : serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    needsReview: false,
    isRecurring: false,
    tags: [],
  });
  
  return docRef.id;
}

// Update an existing transaction
export async function updateTransaction(id: string, updates: Partial<TransactionInput>): Promise<void> {
  const docRef = doc(firestore, COLLECTIONS.TRANSACTIONS, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Delete a transaction
export async function deleteTransaction(id: string): Promise<void> {
  const docRef = doc(firestore, COLLECTIONS.TRANSACTIONS, id);
  await deleteDoc(docRef);
}

// Subscribe to real-time transaction updates
export function subscribeToTransactions(
  callback: (transactions: Transaction[]) => void,
  filters: TransactionFilters = {}
): () => void {
  const constraints: QueryConstraint[] = [];
  
  // Build query constraints
  if (filters.userId) {
    constraints.push(where('userId', '==', filters.userId));
  }
  if (filters.type) {
    constraints.push(where('type', '==', filters.type));
  }
  if (filters.category) {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters.source) {
    constraints.push(where('source', '==', filters.source));
  }
  if (filters.needsReview !== undefined) {
    constraints.push(where('needsReview', '==', filters.needsReview));
  }
  
  // Order by timestamp descending
  constraints.push(orderBy('timestamp', 'desc'));
  
  // Apply limit if specified
  if (filters.limit) {
    constraints.push(limit(filters.limit));
  }
  
  const q = query(collection(firestore, COLLECTIONS.TRANSACTIONS), ...constraints);
  
  return onSnapshot(
    q,
    (snapshot) => {
      const transactions = snapshot.docs.map(docToTransaction);
      callback(transactions);
    },
    (error) => {
      console.error('Transaction subscription error:', error);
      callback([]); // Return empty array on error to prevent infinite loading
    }
  );
}

// Get transaction statistics
export async function getTransactionStats(
  filters: TransactionFilters = {}
): Promise<TransactionStats> {
  const constraints: QueryConstraint[] = [];
  
  if (filters.startDate) {
    constraints.push(where('timestamp', '>=', Timestamp.fromDate(filters.startDate)));
  }
  if (filters.endDate) {
    constraints.push(where('timestamp', '<=', Timestamp.fromDate(filters.endDate)));
  }
  
  const q = query(collection(firestore, COLLECTIONS.TRANSACTIONS), ...constraints);
  const snapshot = await getDocs(q);
  
  const transactions = snapshot.docs.map(docToTransaction);
  
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalIncome: income,
    totalExpenses: expenses,
    netBalance: income - expenses,
    transactionCount: transactions.length,
  };
}

// Mark transaction as reviewed
export async function markAsReviewed(id: string): Promise<void> {
  const docRef = doc(firestore, COLLECTIONS.TRANSACTIONS, id);
  await updateDoc(docRef, {
    needsReview: false,
    updatedAt: serverTimestamp(),
  });
}

// Get transactions needing review
export async function getTransactionsNeedingReview(maxResults: number = 20): Promise<Transaction[]> {
  const q = query(
    collection(firestore, COLLECTIONS.TRANSACTIONS),
    where('needsReview', '==', true),
    orderBy('timestamp', 'desc'),
    limit(maxResults)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToTransaction);
}


// Get recent transactions (helper wrapper)
export async function getRecentTransactions(maxResults: number = 20): Promise<Transaction[]> {
  return getTransactions({ limit: maxResults });
}

// Get transaction count
export async function getTransactionCount(filters: TransactionFilters = {}): Promise<number> {
  const constraints: QueryConstraint[] = [];
  
  if (filters.userId) {
    constraints.push(where('userId', '==', filters.userId));
  }
  if (filters.type) {
    constraints.push(where('type', '==', filters.type));
  }
  if (filters.category) {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters.source) {
    constraints.push(where('source', '==', filters.source));
  }
  if (filters.needsReview !== undefined) {
    constraints.push(where('needsReview', '==', filters.needsReview));
  }
  if (filters.startDate) {
    constraints.push(where('timestamp', '>=', Timestamp.fromDate(filters.startDate)));
  }
  if (filters.endDate) {
    constraints.push(where('timestamp', '<=', Timestamp.fromDate(filters.endDate)));
  }
  
  const q = query(collection(firestore, COLLECTIONS.TRANSACTIONS), ...constraints);
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

