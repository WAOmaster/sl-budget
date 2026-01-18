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
    timestamp: data.timestamp?.toDate?.() || new Date(data.timestamp),
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
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
  
  // Add ordering and limit
  constraints.push(orderBy('timestamp', 'desc'));
  if (filters.limit) {
    constraints.push(limit(filters.limit));
  }
  
  const q = query(collection(firestore, COLLECTIONS.TRANSACTIONS), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToTransaction);
}

// Get single transaction by ID
export async function getTransaction(id: string): Promise<Transaction | null> {
  const docRef = doc(firestore, COLLECTIONS.TRANSACTIONS, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docToTransaction(docSnap) : null;
}

// Add manual transaction
export async function addTransaction(input: TransactionInput): Promise<string> {
  const docRef = await addDoc(collection(firestore, COLLECTIONS.TRANSACTIONS), {
    ...input,
    userId: DEFAULT_USER_ID,
    source: 'manual',
    currency: input.currency || 'LKR',
    needsReview: false,
    timestamp: input.timestamp ? Timestamp.fromDate(input.timestamp) : serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update transaction
export async function updateTransaction(id: string, data: Partial<TransactionInput>): Promise<void> {
  const docRef = doc(firestore, COLLECTIONS.TRANSACTIONS, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete transaction
export async function deleteTransaction(id: string): Promise<void> {
  await deleteDoc(doc(firestore, COLLECTIONS.TRANSACTIONS, id));
}

// Mark transaction as reviewed
export async function markAsReviewed(id: string, category?: string): Promise<void> {
  const updates: Record<string, unknown> = {
    needsReview: false,
    updatedAt: serverTimestamp(),
  };
  if (category) {
    updates.category = category;
  }
  await updateDoc(doc(firestore, COLLECTIONS.TRANSACTIONS, id), updates);
}

// Real-time subscription to transactions
export function subscribeToTransactions(
  callback: (transactions: Transaction[]) => void,
  filters: TransactionFilters = {}
): () => void {
  const constraints: QueryConstraint[] = [];
  
  if (filters.type) {
    constraints.push(where('type', '==', filters.type));
  }
  if (filters.limit) {
    constraints.push(limit(filters.limit));
  }
  constraints.push(orderBy('timestamp', 'desc'));
  
  const q = query(collection(firestore, COLLECTIONS.TRANSACTIONS), ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(docToTransaction));
  });
}

// Get transaction statistics
export async function getTransactionStats(
  startDate?: Date,
  endDate?: Date
): Promise<TransactionStats> {
  const filters: TransactionFilters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  
  const transactions = await getTransactions(filters);
  
  const stats: TransactionStats = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactionCount: transactions.length,
    avgExpense: 0,
    avgIncome: 0,
    byCategory: {},
    bySource: { sms: 0, manual: 0, csv: 0, pdf: 0 },
    byDay: [],
    topMerchants: [],
  };
  
  const merchantMap = new Map<string, { amount: number; count: number }>();
  const dayMap = new Map<string, { income: number; expense: number }>();
  let incomeCount = 0;
  let expenseCount = 0;
  
  for (const tx of transactions) {
    // Income/Expense totals
    if (tx.type === 'income') {
      stats.totalIncome += tx.amount;
      incomeCount++;
    } else if (tx.type === 'expense') {
      stats.totalExpense += tx.amount;
      expenseCount++;
    }
    
    // By category
    if (tx.category) {
      stats.byCategory[tx.category] = (stats.byCategory[tx.category] || 0) + tx.amount;
    }
    
    // By source
    if (tx.source) {
      stats.bySource[tx.source] = (stats.bySource[tx.source] || 0) + tx.amount;
    }
    
    // By merchant
    if (tx.merchant) {
      const existing = merchantMap.get(tx.merchant) || { amount: 0, count: 0 };
      merchantMap.set(tx.merchant, {
        amount: existing.amount + tx.amount,
        count: existing.count + 1,
      });
    }
    
    // By day
    const dateKey = tx.timestamp.toISOString().split('T')[0];
    const dayData = dayMap.get(dateKey) || { income: 0, expense: 0 };
    if (tx.type === 'income') {
      dayData.income += tx.amount;
    } else if (tx.type === 'expense') {
      dayData.expense += tx.amount;
    }
    dayMap.set(dateKey, dayData);
  }
  
  // Calculate derived stats
  stats.balance = stats.totalIncome - stats.totalExpense;
  stats.avgExpense = expenseCount > 0 ? stats.totalExpense / expenseCount : 0;
  stats.avgIncome = incomeCount > 0 ? stats.totalIncome / incomeCount : 0;
  
  // Top merchants
  stats.topMerchants = Array.from(merchantMap.entries())
    .map(([merchant, data]) => ({ merchant, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);
  
  // By day (sorted)
  stats.byDay = Array.from(dayMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  return stats;
}

// Get transactions needing review (from SMS)
export async function getTransactionsNeedingReview(limitCount = 20): Promise<Transaction[]> {
  return getTransactions({ needsReview: true, limit: limitCount });
}

// Get recent transactions
export async function getRecentTransactions(limitCount = 10): Promise<Transaction[]> {
  return getTransactions({ limit: limitCount });
}

// Get transactions count
export async function getTransactionsCount(): Promise<number> {
  const coll = collection(firestore, COLLECTIONS.TRANSACTIONS);
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
}
