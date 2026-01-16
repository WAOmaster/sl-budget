'use client';

import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import { BudgetCard, Budget } from '@/components/budgets';
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils';

// Mock data
const mockBudgets: Budget[] = [
  {
    id: '1',
    name: 'Food & Dining',
    spent: 12500,
    limit: 20000,
    category: { name: 'Food', icon: '🍔', color: '#f97316' },
    period: 'monthly',
    daysRemaining: 15,
  },
  {
    id: '2',
    name: 'Transport',
    spent: 8000,
    limit: 15000,
    category: { name: 'Transport', icon: '🚌', color: '#3b82f6' },
    period: 'monthly',
    daysRemaining: 15,
  },
  {
    id: '3',
    name: 'Shopping',
    spent: 9500,
    limit: 10000,
    category: { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
    period: 'monthly',
    daysRemaining: 15,
  },
  {
    id: '4',
    name: 'Entertainment',
    spent: 3200,
    limit: 8000,
    category: { name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
    period: 'monthly',
    daysRemaining: 15,
  },
  {
    id: '5',
    name: 'Utilities',
    spent: 7800,
    limit: 10000,
    category: { name: 'Bills', icon: '📄', color: '#78716c' },
    period: 'monthly',
    daysRemaining: 15,
  },
];

export default function BudgetsPage() {
  const totalBudget = mockBudgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = mockBudgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Budgets"
        subtitle="Track your spending limits"
        action={
          <Button variant="primary" size="sm">
            <Plus size={16} />
            Add Budget
          </Button>
        }
      />

      {/* Overall Summary */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-stone-800 to-stone-900 text-white">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-stone-400 text-sm mb-1">Total Budget</p>
            <p className="font-mono text-xl font-semibold">{formatCurrencyCompact(totalBudget)}</p>
          </div>
          <div>
            <p className="text-stone-400 text-sm mb-1">Spent</p>
            <p className="font-mono text-xl font-semibold text-cinnamon-400">{formatCurrencyCompact(totalSpent)}</p>
          </div>
          <div>
            <p className="text-stone-400 text-sm mb-1">Remaining</p>
            <p className="font-mono text-xl font-semibold text-tea-400">{formatCurrencyCompact(totalRemaining)}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-tea-500 to-cinnamon-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-stone-400">
            <span>{Math.round((totalSpent / totalBudget) * 100)}% used</span>
            <span>15 days remaining</span>
          </div>
        </div>
      </div>

      {/* Budget Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {mockBudgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onClick={() => console.log('Clicked:', budget)}
          />
        ))}
      </div>

      {/* Empty State */}
      {mockBudgets.length === 0 && (
        <div className="empty-state card py-12">
          <div className="empty-state-icon">
            <span className="text-3xl">💰</span>
          </div>
          <h3 className="empty-state-title">No budgets yet</h3>
          <p className="empty-state-description">
            Create your first budget to start tracking spending
          </p>
          <Button variant="primary">
            <Plus size={16} />
            Create Budget
          </Button>
        </div>
      )}
    </div>
  );
}
