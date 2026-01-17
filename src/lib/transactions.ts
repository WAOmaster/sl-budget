// Transaction Service - Firestore Operations
import { 
  collection, doc, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy, limit, getDocs, onSnapshot,
  Timestamp, serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import type { Transaction, TransactionInput, TransactionFilters, TransactionStats } from "@/types/transaction";

const COLLECTION = "transactions";

// Convert Firestore doc to Transaction
const docToTransaction = (doc: any): Transaction => {
  const data = doc.data();
  return {
    id: doc.id,
    source: data.source || "manual",
    type: data.type,
    category: data.category,
    amount: data.amount,
    currency: data.currency || "LKR",
    merchant: data.merchant,
    description: data.description,
    bank: data.bank,
    cardLast4: data.cardLast4,
    balance: data.balance,
    reference: data.reference,
    rawMessage: data.rawMessage,
    timestamp: data.timestamp?.toDate() || new Date(),
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

// Get transactions with filters
export async function getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  const constraints: any[] = [];
  
  if (filters.type) constraints.push(where("type", "==", filters.type));
  if (filters.category) constraints.push(where("category", "==", filters.category));
  if (filters.source) constraints.push(where("source", "==", filters.source));
  if (filters.startDate) constraints.push(where("timestamp", ">=", Timestamp.fromDate(filters.startDate)));
  if (filters.endDate) constraints.push(where("timestamp", "<=", Timestamp.fromDate(filters.endDate)));
  
  constraints.push(orderBy("timestamp", "desc"));
  if (filters.limit) constraints.push(limit(filters.limit));
  
  const q = query(collection(db, COLLECTION), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToTransaction);
}

// Add manual transaction
export async function addTransaction(input: TransactionInput): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...input,
    source: "manual",
    currency: input.currency || "LKR",
    timestamp: input.timestamp ? Timestamp.fromDate(input.timestamp) : serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update transaction
export async function updateTransaction(id: string, data: Partial<TransactionInput>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: serverTimestamp() });
}

// Delete transaction
export async function deleteTransaction(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

// Real-time subscription
export function subscribeToTransactions(
  callback: (transactions: Transaction[]) => void,
  filters: TransactionFilters = {}
): () => void {
  const constraints: any[] = [];
  if (filters.type) constraints.push(where("type", "==", filters.type));
  if (filters.limit) constraints.push(limit(filters.limit));
  constraints.push(orderBy("timestamp", "desc"));
  
  const q = query(collection(db, COLLECTION), ...constraints);
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(docToTransaction)));
}

// Get statistics
export async function getTransactionStats(startDate?: Date, endDate?: Date): Promise<TransactionStats> {
  const filters: TransactionFilters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  
  const transactions = await getTransactions(filters);
  const stats: TransactionStats = {
    totalIncome: 0, totalExpenses: 0, netBalance: 0,
    transactionCount: transactions.length, byCategory: {}, bySource: {},
  };
  
  transactions.forEach(t => {
    if (t.type === "income") stats.totalIncome += t.amount;
    else if (t.type === "expense") stats.totalExpenses += t.amount;
    stats.byCategory[t.category] = (stats.byCategory[t.category] || 0) + t.amount;
    stats.bySource[t.source] = (stats.bySource[t.source] || 0) + 1;
  });
  
  stats.netBalance = stats.totalIncome - stats.totalExpenses;
  return stats;
}
