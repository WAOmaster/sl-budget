// Transaction Service with Fixed Timestamp Conversion
// src/services/transactionService.ts

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { db, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase';
import type { Transaction, TransactionInput, TransactionFilters, TransactionStats } from '@/types';

const COLLECTION = COLLECTIONS.TRANSACTIONS;

// FIXED: Proper Timestamp to Date conversion
function convertTimestamp(timestamp: any): Date {
  // If already a Date, return it
  if (timestamp instanceof Date) {
    return timestamp;
  }
  
  // If Firestore Timestamp with toDate method
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  
  // If Firestore Timestamp object with _seconds
  if (timestamp && timestamp._seconds) {
    return new Date(timestamp._seconds * 1000);
  }
  
  // If string or number, try to parse
  if (timestamp) {
    return new Date(timestamp);
  }
  
  // Fallback to current date
  return new Date();
}

// Convert Firestore document to Transaction type
function docToTransaction(docSnap: DocumentData): Transaction {
  const data = docSnap.data();
  
  return {
    id: docSnap.id,
    type: data.type || 'expense',
    category: data.category || 'uncategorized',
    amount: data.amount || 0,
    description: data.description,
    merchant: data.merchant,
    bank: data.bank,
    cardLast4: data.cardLast4,
    balance: data.balance,
    currency: data.currency || 'LKR',
    source: data.source || 'manual',
    rawMessage: data.rawMessage,
    simNumber: data.simNumber,
    needsReview: data.needsReview || false,
    // FIXED: Use convertTimestamp helper
    timestamp: convertTimestamp(data.timestamp),
    createdAt: data.createdAt ? convertTimestamp(data.createdAt) : new Date(),
    updatedAt: data.updatedAt ? convertTimestamp(data.updatedAt) : null,
    // Convert date if present
    date: data.date ? convertTimestamp(data.date) : convertTimestamp(data.timestamp),
  };
}

// Get single transaction
export async function getTransaction(id: string): Promise<Transaction | null> {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docToTransaction(docSnap) : null;
}

// Get transactions with filters
export async function getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const constraints: any[] = [];
  
  if (filters.type) constraints.push(where('type', '==', filters.type));
  if (filters.category) constraints.push(where('category', '==', filters.category));
  if (filters.source) constraints.push(where('source', '==', filters.source));
  if (filters.startDate) constraints.push(where('timestamp', '>=', Timestamp.fromDate(filters.startDate)));
  if (filters.endDate) constraints.push(where('timestamp', '<=', Timestamp.fromDate(filters.endDate)));
  
  constraints.push(orderBy('timestamp', 'desc'));
  if (filters.limit) constraints.push(limit(filters.limit));
  
  const q = query(collection(db, COLLECTION), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToTransaction);
}

// Add manual transaction
export async function addTransaction(input: TransactionInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    source: 'manual',
    currency: input.currency || 'LKR',
    timestamp: input.timestamp ? Timestamp.fromDate(input.timestamp) : serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update transaction
export async function updateTransaction(id: string, data: Partial<TransactionInput>): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete transaction
export async function deleteTransaction(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

// Mark transaction as reviewed
export async function markAsReviewed(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    needsReview: false,
    updatedAt: serverTimestamp(),
  });
}

// Real-time subscription with error handling
export function subscribeToTransactions(
  callback: (transactions: Transaction[]) => void,
  filters: TransactionFilters = {}
): () => void {
  const constraints: any[] = [];
  
  if (filters.type) constraints.push(where('type', '==', filters.type));
  if (filters.category) constraints.push(where('category', '==', filters.category));
  if (filters.source) constraints.push(where('source', '==', filters.source));
  if (filters.limit) constraints.push(limit(filters.limit));
  
  // Always order by timestamp descending
  constraints.push(orderBy('timestamp', 'desc'));
  
  const q = query(collection(db, COLLECTION), ...constraints);
  
  return onSnapshot(
    q, 
    (snapshot) => {
      const transactions = snapshot.docs.map(docToTransaction);
      callback(transactions);
    },
    (error) => {
      console.error('Firestore subscription error:', error);
      // Call callback with empty array on error to prevent infinite loading
      callback([]);
    }
  );
}

// Get transactions needing review
export async function getTransactionsNeedingReview(maxResults: number = 20): Promise<Transaction[]> {
  const q = query(
    collection(db, COLLECTION),
    where('needsReview', '==', true),
    orderBy('timestamp', 'desc'),
    limit(maxResults)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToTransaction);
}

// Get transaction statistics
export async function getTransactionStats(
  startDate?: Date,
  endDate?: Date
): Promise<TransactionStats> {
  const constraints: any[] = [];
  
  if (startDate) constraints.push(where('timestamp', '>=', Timestamp.fromDate(startDate)));
  if (endDate) constraints.push(where('timestamp', '<=', Timestamp.fromDate(endDate)));
  
  const q = query(collection(db, COLLECTION), ...constraints);
  const snapshot = await getDocs(q);
  
  const transactions = snapshot.docs.map(docToTransaction);
  
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense' || t.type === 'transfer')
    .reduce((sum, t) => sum + t.amount, 0);
  
  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
  };
}
