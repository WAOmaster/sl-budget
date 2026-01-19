// React Hooks for Firestore Data
// Real-time subscriptions and data fetching

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getTransactions,
  subscribeToTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats,
  getRecentTransactions,
  getTransactionsNeedingReview,
} from '@/services/transactionService';
import {
  getCategories,
  getCategoriesByType,
  addCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categoryService';
import {
  getBills,
  getUpcomingBills,
  getOverdueBills,
  addBill,
  updateBill,
  markBillAsPaid,
  deleteBill,
  getBillSummary,
} from '@/services/billService';
import {
  getBudgets,
  getActiveBudgetsWithSpending,
  addBudget,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
} from '@/services/budgetService';
import type {
  Transaction,
  TransactionInput,
  TransactionFilters,
  TransactionStats,
  Category,
  CategoryInput,
  Bill,
  BillInput,
  Budget,
  BudgetInput,
} from '@/types';

// ============ TRANSACTIONS HOOK ============
export function useTransactions(filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransactions(filters);
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const add = async (input: TransactionInput) => {
    const id = await addTransaction(input);
    await fetchTransactions();
    return id;
  };

  const update = async (id: string, data: Partial<TransactionInput>) => {
    await updateTransaction(id, data);
    await fetchTransactions();
  };

  const remove = async (id: string) => {
    await deleteTransaction(id);
    await fetchTransactions();
  };

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    add,
    update,
    remove,
  };
}

// Real-time transactions subscription
export function useRealtimeTransactions(filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToTransactions((data) => {
      setTransactions(data);
      setLoading(false);
    }, filters);

    return () => unsubscribe();
  }, [JSON.stringify(filters)]);

  return { transactions, loading };
}

// ============ TRANSACTION STATS HOOK ============
export function useTransactionStats(startDate?: Date, endDate?: Date) {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getTransactionStats({ startDate, endDate });
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  return { stats, loading, error };
}

// ============ CATEGORIES HOOK ============
export function useCategories(type?: 'income' | 'expense' | 'both') {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = type ? await getCategoriesByType(type) : await getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const add = async (input: CategoryInput) => {
    const id = await addCategory(input);
    await fetchCategories();
    return id;
  };

  const update = async (id: string, data: Partial<CategoryInput>) => {
    await updateCategory(id, data);
    await fetchCategories();
  };

  const remove = async (id: string) => {
    await deleteCategory(id);
    await fetchCategories();
  };

  // Memoized helpers
  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'expense' || c.type === 'both'),
    [categories]
  );

  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === 'income' || c.type === 'both'),
    [categories]
  );

  const getCategoryById = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories]
  );

  const getCategoryByName = useCallback(
    (name: string) => categories.find((c) => c.name.toLowerCase() === name.toLowerCase()),
    [categories]
  );

  return {
    categories,
    expenseCategories,
    incomeCategories,
    loading,
    error,
    refetch: fetchCategories,
    add,
    update,
    remove,
    getCategoryById,
    getCategoryByName,
  };
}

// ============ BILLS HOOK ============
export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [upcoming, setUpcoming] = useState<Bill[]>([]);
  const [overdue, setOverdue] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBills = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [allBills, upcomingBills, overdueBills] = await Promise.all([
        getBills(),
        getUpcomingBills(7),
        getOverdueBills(),
      ]);
      setBills(allBills);
      setUpcoming(upcomingBills);
      setOverdue(overdueBills);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  const add = async (input: BillInput) => {
    const id = await addBill(input);
    await fetchBills();
    return id;
  };

  const update = async (id: string, data: Partial<BillInput>) => {
    await updateBill(id, data);
    await fetchBills();
  };

  const markPaid = async (id: string, amount?: number) => {
    await markBillAsPaid(id, amount);
    await fetchBills();
  };

  const remove = async (id: string) => {
    await deleteBill(id);
    await fetchBills();
  };

  return {
    bills,
    upcoming,
    overdue,
    loading,
    error,
    refetch: fetchBills,
    add,
    update,
    markPaid,
    remove,
  };
}

// ============ BILL SUMMARY HOOK ============
export function useBillSummary() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof getBillSummary>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getBillSummary();
        setSummary(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return { summary, loading };
}

// ============ BUDGETS HOOK ============
export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetsWithSpending, setBudgetsWithSpending] = useState<
    Awaited<ReturnType<typeof getActiveBudgetsWithSpending>>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [all, withSpending] = await Promise.all([
        getBudgets(),
        getActiveBudgetsWithSpending(),
      ]);
      setBudgets(all);
      setBudgetsWithSpending(withSpending);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const add = async (input: BudgetInput) => {
    const id = await addBudget(input);
    await fetchBudgets();
    return id;
  };

  const update = async (id: string, data: Partial<BudgetInput>) => {
    await updateBudget(id, data);
    await fetchBudgets();
  };

  const remove = async (id: string) => {
    await deleteBudget(id);
    await fetchBudgets();
  };

  return {
    budgets,
    budgetsWithSpending,
    loading,
    error,
    refetch: fetchBudgets,
    add,
    update,
    remove,
  };
}

// ============ BUDGET SUMMARY HOOK ============
export function useBudgetSummary() {
  const [summary, setSummary] = useState<Awaited<ReturnType<typeof getBudgetSummary>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getBudgetSummary();
        setSummary(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return { summary, loading };
}

// ============ DASHBOARD DATA HOOK ============
export function useDashboardData() {
  const [data, setData] = useState<{
    recentTransactions: Transaction[];
    stats: TransactionStats | null;
    upcomingBills: Bill[];
    budgetSummary: Awaited<ReturnType<typeof getBudgetSummary>> | null;
    pendingReview: Transaction[];
  }>({
    recentTransactions: [],
    stats: null,
    upcomingBills: [],
    budgetSummary: null,
    pendingReview: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current month date range
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const [recentTransactions, stats, upcomingBills, budgetSummary, pendingReview] =
        await Promise.all([
          getRecentTransactions(10),
          getTransactionStats({ startDate: startOfMonth, endDate: endOfMonth }),
          getUpcomingBills(7),
          getBudgetSummary(),
          getTransactionsNeedingReview(5),
        ]);

      setData({
        recentTransactions,
        stats,
        upcomingBills,
        budgetSummary,
        pendingReview,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { ...data, loading, error, refetch: fetchDashboardData };
}

// ============ PENDING REVIEW HOOK ============
export function usePendingReview() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransactionsNeedingReview(20);
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  return { transactions, loading, refetch: fetchPending };
}



