'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatCurrencyCompact, cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  variant?: 'default' | 'income' | 'expense' | 'savings';
  compact?: boolean;
}

export function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  variant = 'default',
  compact = false,
}: StatCardProps) {
  const hasChange = change !== undefined && change !== 0;
  const isPositiveChange = change && change > 0;

  const variantColors = {
    default: 'text-stone-900',
    income: 'text-tea-600',
    expense: 'text-stone-900',
    savings: 'text-ocean-600',
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <span className="stat-label">{label}</span>
        {icon && <span className="text-stone-400">{icon}</span>}
      </div>
      <div className={cn('stat-value', variantColors[variant])}>
        {compact ? formatCurrencyCompact(value) : formatCurrency(value)}
      </div>
      {hasChange && (
        <div className="flex items-center gap-1 mt-1">
          {isPositiveChange ? (
            <TrendingUp size={14} className="text-tea-500" />
          ) : (
            <TrendingDown size={14} className="text-red-500" />
          )}
          <span className={cn(
            'text-xs font-medium',
            isPositiveChange ? 'text-tea-600' : 'text-red-600'
          )}>
            {isPositiveChange ? '+' : ''}{change}%
            {changeLabel && <span className="text-stone-400 ml-1">{changeLabel}</span>}
          </span>
        </div>
      )}
    </div>
  );
}

// Balance card with progress
interface BalanceCardProps {
  balance: number;
  budgetUsed: number;
  budgetTotal: number;
  userName?: string;
}

export function BalanceCard({ balance, budgetUsed, budgetTotal, userName }: BalanceCardProps) {
  const percentage = budgetTotal > 0 ? Math.round((budgetUsed / budgetTotal) * 100) : 0;
  const remaining = 100 - percentage;

  // Get time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="card p-6 bg-gradient-to-br from-cinnamon-500 to-cinnamon-600 text-white">
      {userName && (
        <p className="text-cinnamon-100 text-sm mb-3">{greeting}, {userName}</p>
      )}
      <p className="text-cinnamon-100 text-sm font-medium mb-1">Your Balance</p>
      <p className="font-mono text-3xl font-bold tracking-tight mb-4">
        {formatCurrency(balance)}
      </p>

      {/* Budget Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-cinnamon-100 mb-2">
          <span>Monthly Budget</span>
          <span>{remaining}% remaining</span>
        </div>
        <div className="h-2 bg-cinnamon-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/90 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Stats grid for dashboard
interface StatsGridProps {
  income: number;
  expenses: number;
  savings: number;
  incomeChange?: number;
  expenseChange?: number;
  savingsChange?: number;
}

export function StatsGrid({
  income,
  expenses,
  savings,
  incomeChange,
  expenseChange,
  savingsChange,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard
        label="Income"
        value={income}
        change={incomeChange}
        variant="income"
        compact
      />
      <StatCard
        label="Expenses"
        value={expenses}
        change={expenseChange}
        variant="expense"
        compact
      />
      <StatCard
        label="Savings"
        value={savings}
        change={savingsChange}
        variant="savings"
        compact
      />
    </div>
  );
}
