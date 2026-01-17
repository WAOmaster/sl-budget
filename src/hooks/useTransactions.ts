// React Hooks for Transactions
"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  getTransactions, addTransaction, updateTransaction, deleteTransaction,
  subscribeToTransactions, getTransactionStats 
} from "@/lib/transactions";
import type { Transaction, TransactionInput, TransactionFilters, TransactionStats } from "@/types/transaction";

// Hook for fetching transactions
export function useTransactions(filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransactions(filters);
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { refetch(); }, [refetch]);
  return { transactions, loading, error, refetch };
}

// Hook for real-time transactions
export function useRealtimeTransactions(filters: TransactionFilters = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToTransactions((data) => {
      setTransactions(data);
      setLoading(false);
      setError(null);
    }, filters);
    return () => unsubscribe();
  }, [JSON.stringify(filters)]);

  return { transactions, loading, error };
}

// Hook for transaction mutations
export function useTransactionMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = async (input: TransactionInput): Promise<string | null> => {
    try {
      setLoading(true);
      setError(null);
      return await addTransaction(input);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: Partial<TransactionInput>): Promise<boolean> => {
    try {
      setLoading(true);
      await updateTransaction(id, data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      await deleteTransaction(id);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { add, update, remove, loading, error };
}

// Hook for transaction statistics
export function useTransactionStats(startDate?: Date, endDate?: Date) {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTransactionStats(startDate, endDate);
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  }, [startDate?.toISOString(), endDate?.toISOString()]);

  useEffect(() => { refetch(); }, [refetch]);
  return { stats, loading, error, refetch };
}
