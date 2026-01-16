'use client';

import { formatCurrency, formatCurrencyCompact, calculatePercentage, cn } from '@/lib/utils';
import { Progress } from '@/components/ui';

export interface Budget {
  id: string;
  name: string;
  spent: number;
  limit: number;
  category?: {
    name: string;
    icon: string;
    color: string;
  };
  period: 'monthly' | 'yearly';
  daysRemaining?: number;
}

interface BudgetCardProps {
  budget: Budget;
  onClick?: () => void;
}

export function BudgetCard({ budget, onClick }: BudgetCardProps) {
  const percentage = calculatePercentage(budget.spent, budget.limit);
  const remaining = budget.limit - budget.spent;
  const isOverBudget = remaining < 0;

  const getStatus = () => {
    if (isOverBudget) return { label: 'Over Budget', variant: 'danger' as const };
    if (percentage >= 90) return { label: 'Critical', variant: 'danger' as const };
    if (percentage >= 70) return { label: 'Warning', variant: 'warning' as const };
    return { label: 'On Track', variant: 'success' as const };
  };

  const status = getStatus();

  return (
    <div
      className="card card-padding card-interactive"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: budget.category?.color + '20' }}
          >
            <span className="text-lg">{budget.category?.icon || '💰'}</span>
          </div>
          <div>
            <h3 className="font-medium text-stone-900">{budget.name}</h3>
            <p className="text-xs text-stone-500 capitalize">{budget.period}</p>
          </div>
        </div>
        <span className={cn(
          'badge',
          status.variant === 'success' && 'badge-success',
          status.variant === 'warning' && 'badge-warning',
          status.variant === 'danger' && 'badge-danger',
        )}>
          {status.label}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-mono font-medium text-stone-900">
            {formatCurrencyCompact(budget.spent)}
          </span>
          <span className="text-stone-500">
            of {formatCurrencyCompact(budget.limit)}
          </span>
        </div>
        <Progress value={budget.spent} max={budget.limit} />
      </div>

      {/* Footer Stats */}
      <div className="flex justify-between text-xs">
        <div>
          <span className="text-stone-500">Remaining: </span>
          <span className={cn(
            'font-medium',
            isOverBudget ? 'text-red-600' : 'text-tea-600'
          )}>
            {isOverBudget ? '-' : ''}{formatCurrencyCompact(Math.abs(remaining))}
          </span>
        </div>
        {budget.daysRemaining !== undefined && (
          <span className="text-stone-400">
            {budget.daysRemaining} days left
          </span>
        )}
      </div>
    </div>
  );
}

// Compact budget summary for dashboard
interface BudgetSummaryProps {
  budgets: Budget[];
}

export function BudgetSummary({ budgets }: BudgetSummaryProps) {
  return (
    <div className="space-y-3">
      {budgets.map((budget) => {
        const percentage = calculatePercentage(budget.spent, budget.limit);
        return (
          <div key={budget.id} className="flex items-center gap-3">
            <span className="text-lg">{budget.category?.icon || '💰'}</span>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-stone-700">{budget.name}</span>
                <span className="text-stone-500">{percentage}%</span>
              </div>
              <Progress value={budget.spent} max={budget.limit} size="sm" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
