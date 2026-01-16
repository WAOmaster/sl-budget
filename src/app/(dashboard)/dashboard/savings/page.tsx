'use client';

import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import { SavingsList, SavingsGoal } from '@/components/savings';
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils';

// Mock data
const mockGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'Arugam Bay Trip',
    targetAmount: 75000,
    currentAmount: 45000,
    deadline: new Date('2026-04-15'),
    icon: '🏖️',
  },
  {
    id: '2',
    name: 'New Laptop',
    targetAmount: 250000,
    currentAmount: 125000,
    deadline: new Date('2026-06-01'),
    icon: '💻',
  },
  {
    id: '3',
    name: 'Emergency Fund',
    targetAmount: 500000,
    currentAmount: 180000,
    icon: '🛡️',
  },
  {
    id: '4',
    name: 'Wedding Fund',
    targetAmount: 1000000,
    currentAmount: 320000,
    deadline: new Date('2027-01-01'),
    icon: '💍',
  },
];

export default function SavingsPage() {
  const totalSaved = mockGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = mockGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Savings Goals"
        subtitle="Track your financial goals"
        action={
          <Button variant="primary" size="sm">
            <Plus size={16} />
            New Goal
          </Button>
        }
      />

      {/* Summary */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-ocean-100 text-sm mb-1">Total Saved</p>
            <p className="font-mono text-3xl font-bold">{formatCurrencyCompact(totalSaved)}</p>
          </div>
          <div className="text-right">
            <p className="text-ocean-100 text-sm mb-1">Target</p>
            <p className="font-mono text-2xl font-semibold text-ocean-100">{formatCurrencyCompact(totalTarget)}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="h-2 bg-ocean-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/90 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%` }}
            />
          </div>
          <p className="text-ocean-100 text-sm mt-2">
            {Math.round((totalSaved / totalTarget) * 100)}% of total goal achieved
          </p>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {mockGoals.map((goal) => (
          <div key={goal.id}>
            <SavingsList
              goals={[goal]}
              onGoalClick={(g) => console.log('Clicked:', g)}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {mockGoals.length === 0 && (
        <div className="empty-state card py-12">
          <div className="empty-state-icon">
            <span className="text-3xl">🎯</span>
          </div>
          <h3 className="empty-state-title">No savings goals yet</h3>
          <p className="empty-state-description">
            Set a goal and start saving today!
          </p>
          <Button variant="primary">
            <Plus size={16} />
            Create Goal
          </Button>
        </div>
      )}
    </div>
  );
}
