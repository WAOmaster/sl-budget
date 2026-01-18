'use client';

import Link from 'next/link';
import { ChevronRight, TrendingUp, Wallet, Plus, Loader2 } from 'lucide-react';
import { BalanceCard, StatsGrid } from '@/components/stats';
import { TransactionList, Transaction } from '@/components/transactions';
import { BudgetSummary, Budget } from '@/components/budgets';
import { formatCurrency } from '@/lib/utils';
import { useRealtimeTransactions, useTransactionStats } from '@/hooks/useTransactions';
import { useAppStore } from '@/stores/app-store';
import { differenceInDays } from 'date-fns';
import { useMemo } from 'react';

// Category icon mapping
const categoryIcons: Record<string, string> = {
  groceries: '🛒',
  food: '🍔',
  dining: '🍽️',
  transport: '🚗',
  utilities: '💡',
  entertainment: '🎬',
  shopping: '🛍️',
  health: '💊',
  education: '📚',
  salary: '💰',
  transfer: '↔️',
  purchase: '💳',
  withdrawal: '🏧',
  payment: '💸',
  uncategorized: '📋',
};

export default function DashboardPage() {
  // Firestore real-time data
  const { transactions: firestoreTransactions, loading } = useRealtimeTransactions({ limit: 50 });
  const { stats } = useTransactionStats();
  
  // Fallback to store for budgets, bills, user (not yet migrated)
  const { budgets, bills, user } = useAppStore();

  // Transform Firestore transactions to display format
  const displayTransactions: Transaction[] = useMemo(() => {
    return firestoreTransactions.slice(0, 4).map((t) => ({
      id: t.id,
      description: t.merchant || t.description || t.category || 'Transaction',
      amount: t.amount,
      type: (t.type === 'transfer' ? 'expense' : t.type) as 'expense' | 'income',
      category: { 
        name: t.category || 'uncategorized', 
        icon: categoryIcons[t.category?.toLowerCase() || 'uncategorized'] || '📋'
      },
      date: t.timestamp instanceof Date ? t.timestamp : new Date(t.timestamp),
      bank: t.bank || t.source,
    }));
  }, [firestoreTransactions]);

  // Calculate stats from Firestore transactions
  const calculatedStats = useMemo(() => {
    const income = firestoreTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const expenses = firestoreTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return { income, expenses, balance: income - expenses };
  }, [firestoreTransactions]);

  const displayBudgets: Budget[] = budgets.slice(0, 3).map((b) => ({
    id: b.id,
    name: b.category,
    spent: b.spent,
    limit: b.limit,
    category: { name: b.category, icon: b.categoryIcon, color: '#e87a1b' },
    period: b.period,
    daysRemaining: 15,
  }));

  const upcomingBills = bills
    .filter((b) => !b.isPaid)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  const balance = calculatedStats.income - calculatedStats.expenses + 80000;
  const monthlyBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const budgetUsed = budgets.reduce((sum, b) => sum + b.spent, 0);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Balance Card */}
      <BalanceCard
        balance={balance}
        budgetUsed={budgetUsed}
        budgetTotal={monthlyBudget}
        userName={user?.name}
      />

      {/* Stats Grid */}
      <StatsGrid
        income={calculatedStats.income}
        expenses={calculatedStats.expenses}
        savings={calculatedStats.income - calculatedStats.expenses}
        incomeChange={12}
        expenseChange={-8}
        savingsChange={5}
      />

      {/* Recent Transactions */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Recent Transactions</h2>
          <Link href="/dashboard/transactions" className="section-action flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        {displayTransactions.length > 0 ? (
          <TransactionList transactions={displayTransactions} />
        ) : (
          <div className="card p-8 text-center">
            <p className="text-muted-foreground mb-4">No transactions yet</p>
            <Link 
              href="/dashboard/transactions/add"
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              <Plus size={16} />
              Add Transaction
            </Link>
          </div>
        )}
      </section>

      {/* Budget Summary */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Budget Overview</h2>
          <Link href="/dashboard/budgets" className="section-action flex items-center gap-1">
            Manage <ChevronRight size={16} />
          </Link>
        </div>
        <BudgetSummary budgets={displayBudgets} />
      </section>

      {/* Upcoming Bills */}
      {upcomingBills.length > 0 && (
        <section>
          <div className="section-header">
            <h2 className="section-title">Upcoming Bills</h2>
            <Link href="/dashboard/bills" className="section-action flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="card divide-y divide-border">
            {upcomingBills.map((bill) => {
              const daysUntilDue = differenceInDays(new Date(bill.dueDate), new Date());
              return (
                <div key={bill.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{bill.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {daysUntilDue === 0 ? 'Due today' : 
                       daysUntilDue === 1 ? 'Due tomorrow' :
                       `Due in ${daysUntilDue} days`}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(bill.amount)}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Transaction count indicator */}
      <div className="text-center text-sm text-muted-foreground">
        {firestoreTransactions.length} transactions synced from Firestore
      </div>
    </div>
  );
}
