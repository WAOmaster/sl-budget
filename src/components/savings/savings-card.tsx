'use client';

import { formatCurrency, formatCurrencyCompact, calculatePercentage, cn } from '@/lib/utils';
import { Progress, Button } from '@/components/ui';
import { format, differenceInDays } from 'date-fns';
import { Plus } from 'lucide-react';

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  icon?: string;
}

interface SavingsCardProps {
  goal: SavingsGoal;
  onAddFunds?: () => void;
  onClick?: () => void;
}

export function SavingsCard({ goal, onAddFunds, onClick }: SavingsCardProps) {
  const percentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
  const remaining = goal.targetAmount - goal.currentAmount;
  const isComplete = goal.currentAmount >= goal.targetAmount;

  const daysUntilDeadline = goal.deadline
    ? differenceInDays(goal.deadline, new Date())
    : null;

  return (
    <div
      className={cn(
        'card card-padding',
        onClick && 'cursor-pointer hover:bg-stone-50'
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-ocean-100 flex items-center justify-center">
          <span className="text-2xl">{goal.icon || '🎯'}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-stone-900">{goal.name}</h3>
          {goal.deadline && (
            <p className="text-sm text-stone-500">
              Target: {format(goal.deadline, 'MMMM yyyy')}
            </p>
          )}
        </div>
        {isComplete && (
          <span className="badge badge-success">Complete!</span>
        )}
      </div>

      {/* Amount */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-mono text-2xl font-bold text-stone-900">
          {formatCurrencyCompact(goal.currentAmount)}
        </span>
        <span className="text-stone-400">/</span>
        <span className="font-mono text-lg text-stone-500">
          {formatCurrencyCompact(goal.targetAmount)}
        </span>
      </div>

      {/* Progress */}
      <Progress value={goal.currentAmount} max={goal.targetAmount} variant="success" />

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm">
          {!isComplete && (
            <span className="text-stone-500">
              {formatCurrencyCompact(remaining)} more to go
              {daysUntilDeadline !== null && daysUntilDeadline > 0 && (
                <span className="text-stone-400"> • {daysUntilDeadline} days left</span>
              )}
            </span>
          )}
        </div>
        {!isComplete && onAddFunds && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddFunds();
            }}
          >
            <Plus size={16} />
            Add Funds
          </Button>
        )}
      </div>
    </div>
  );
}

// Compact savings list for dashboard
interface SavingsListProps {
  goals: SavingsGoal[];
  onGoalClick?: (goal: SavingsGoal) => void;
}

export function SavingsList({ goals, onGoalClick }: SavingsListProps) {
  if (goals.length === 0) {
    return (
      <div className="empty-state py-6">
        <div className="empty-state-icon">
          <span className="text-2xl">🎯</span>
        </div>
        <h3 className="empty-state-title">No savings goals</h3>
        <p className="empty-state-description">
          Set a goal and start saving!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {goals.map((goal) => (
        <SavingsCard
          key={goal.id}
          goal={goal}
          onClick={() => onGoalClick?.(goal)}
        />
      ))}
    </div>
  );
}
