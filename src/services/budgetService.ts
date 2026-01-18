// Budget Service - Manage spending budgets
// Track spending against category or total budgets

import {
  collection,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { firestore, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase';
import { getTransactions } from './transactionService';
import type { Budget, BudgetInput, BudgetPeriod } from '@/types';

// Convert Firestore document to Budget
function docToBudget(doc: any): Budget {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    name: data.name,
    categoryId: data.categoryId,
    category: data.category,
    amount: Number(data.amount) || 0,
    spent: Number(data.spent) || 0,
    currency: data.currency || 'LKR',
    period: data.period || 'monthly',
    startDate: data.startDate?.toDate() || new Date(),
    endDate: data.endDate?.toDate() || new Date(),
    alertThreshold: data.alertThreshold || 80,
    isActive: data.isActive !== false,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
}

// Calculate period dates
function getPeriodDates(period: BudgetPeriod, startDate?: Date): { start: Date; end: Date } {
  const start = startDate || new Date();
  const end = new Date(start);
  
  // Reset to start of day
  start.setHours(0, 0, 0, 0);
  
  switch (period) {
    case 'weekly':
      // Start of week (Sunday)
      start.setDate(start.getDate() - start.getDay());
      end.setTime(start.getTime());
      end.setDate(end.getDate() + 6);
      break;
    case 'monthly':
      // Start of month
      start.setDate(1);
      end.setTime(start.getTime());
      end.setMonth(end.getMonth() + 1);
      end.setDate(0); // Last day of current month
      break;
    case 'yearly':
      // Start of year
      start.setMonth(0, 1);
      end.setTime(start.getTime());
      end.setFullYear(end.getFullYear() + 1);
      end.setDate(0);
      break;
  }
  
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

// Get all budgets for a user
export async function getBudgets(userId: string = DEFAULT_USER_ID): Promise<Budget[]> {
  const q = query(
    collection(firestore, COLLECTIONS.BUDGETS),
    where('userId', '==', userId),
    where('isActive', '==', true),
    orderBy('name', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToBudget);
}

// Get active budgets with current spending
export async function getActiveBudgetsWithSpending(
  userId: string = DEFAULT_USER_ID
): Promise<(Budget & { remaining: number; percentUsed: number; isOverBudget: boolean })[]> {
  const budgets = await getBudgets(userId);
  const result = [];
  
  for (const budget of budgets) {
    const spent = await calculateBudgetSpent(budget);
    const remaining = budget.amount - spent;
    const percentUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    
    result.push({
      ...budget,
      spent,
      remaining,
      percentUsed,
      isOverBudget: spent > budget.amount,
    });
  }
  
  return result;
}

// Calculate spent amount for a budget
async function calculateBudgetSpent(budget: Budget): Promise<number> {
  const transactions = await getTransactions({
    type: 'expense',
    category: budget.category || undefined,
    startDate: budget.startDate,
    endDate: budget.endDate,
  });
  
  return transactions.reduce((sum, tx) => sum + tx.amount, 0);
}

// Get single budget
export async function getBudget(id: string): Promise<Budget | null> {
  const docRef = doc(firestore, COLLECTIONS.BUDGETS, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docToBudget(docSnap) : null;
}

// Get budget by category
export async function getBudgetByCategory(
  categoryId: string,
  userId: string = DEFAULT_USER_ID
): Promise<Budget | null> {
  const q = query(
    collection(firestore, COLLECTIONS.BUDGETS),
    where('userId', '==', userId),
    where('categoryId', '==', categoryId),
    where('isActive', '==', true)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : docToBudget(snapshot.docs[0]);
}

// Add new budget
export async function addBudget(
  input: BudgetInput,
  userId: string = DEFAULT_USER_ID
): Promise<string> {
  const { start, end } = getPeriodDates(input.period, input.startDate);
  
  const docRef = await addDoc(collection(firestore, COLLECTIONS.BUDGETS), {
    ...input,
    userId,
    currency: 'LKR',
    spent: 0,
    startDate: Timestamp.fromDate(start),
    endDate: Timestamp.fromDate(end),
    alertThreshold: input.alertThreshold || 80,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return docRef.id;
}

// Update budget
export async function updateBudget(id: string, data: Partial<BudgetInput>): Promise<void> {
  const updates: Record<string, unknown> = { ...data, updatedAt: serverTimestamp() };
  
  // Recalculate dates if period changes
  if (data.period) {
    const { start, end } = getPeriodDates(data.period, data.startDate);
    updates.startDate = Timestamp.fromDate(start);
    updates.endDate = Timestamp.fromDate(end);
  }
  
  await updateDoc(doc(firestore, COLLECTIONS.BUDGETS, id), updates);
}

// Delete budget (soft delete)
export async function deleteBudget(id: string): Promise<void> {
  await updateDoc(doc(firestore, COLLECTIONS.BUDGETS, id), {
    isActive: false,
    updatedAt: serverTimestamp(),
  });
}

// Refresh budget period (for recurring budgets)
export async function refreshBudgetPeriod(id: string): Promise<void> {
  const budget = await getBudget(id);
  if (!budget) throw new Error('Budget not found');
  
  const { start, end } = getPeriodDates(budget.period);
  
  await updateDoc(doc(firestore, COLLECTIONS.BUDGETS, id), {
    startDate: Timestamp.fromDate(start),
    endDate: Timestamp.fromDate(end),
    spent: 0,
    updatedAt: serverTimestamp(),
  });
}

// Get budgets needing alert (spent >= threshold)
export async function getBudgetsNeedingAlert(
  userId: string = DEFAULT_USER_ID
): Promise<Budget[]> {
  const budgets = await getActiveBudgetsWithSpending(userId);
  return budgets.filter(b => b.percentUsed >= b.alertThreshold);
}

// Get budget summary
export async function getBudgetSummary(userId: string = DEFAULT_USER_ID): Promise<{
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  overBudgetCount: number;
  nearLimitCount: number;
  healthyCount: number;
  budgets: (Budget & { remaining: number; percentUsed: number })[];
}> {
  const budgets = await getActiveBudgetsWithSpending(userId);
  
  let totalBudget = 0;
  let totalSpent = 0;
  let overBudgetCount = 0;
  let nearLimitCount = 0;
  let healthyCount = 0;
  
  for (const budget of budgets) {
    totalBudget += budget.amount;
    totalSpent += budget.spent;
    
    if (budget.percentUsed > 100) {
      overBudgetCount++;
    } else if (budget.percentUsed >= budget.alertThreshold) {
      nearLimitCount++;
    } else {
      healthyCount++;
    }
  }
  
  return {
    totalBudget,
    totalSpent,
    totalRemaining: totalBudget - totalSpent,
    overBudgetCount,
    nearLimitCount,
    healthyCount,
    budgets,
  };
}

// Create default budgets for a user
export async function createDefaultBudgets(userId: string): Promise<void> {
  const defaultBudgets: BudgetInput[] = [
    { name: 'Food & Dining', category: 'Food & Dining', amount: 25000, period: 'monthly' },
    { name: 'Transportation', category: 'Transportation', amount: 15000, period: 'monthly' },
    { name: 'Entertainment', category: 'Entertainment', amount: 10000, period: 'monthly' },
    { name: 'Shopping', category: 'Shopping', amount: 20000, period: 'monthly' },
  ];
  
  for (const budget of defaultBudgets) {
    await addBudget(budget, userId);
  }
}
