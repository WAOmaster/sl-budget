'use client';

import { formatCurrency, cn } from '@/lib/utils';
import { Badge, Button } from '@/components/ui';
import { differenceInDays, format } from 'date-fns';

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  frequency: 'one_time' | 'monthly' | 'quarterly' | 'yearly';
  isPaid: boolean;
  category?: {
    icon: string;
  };
}

interface BillCardProps {
  bill: Bill;
  onMarkPaid?: () => void;
  onClick?: () => void;
}

export function BillCard({ bill, onMarkPaid, onClick }: BillCardProps) {
  const today = new Date();
  const daysUntilDue = differenceInDays(bill.dueDate, today);
  const isOverdue = daysUntilDue < 0 && !bill.isPaid;
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0 && !bill.isPaid;

  const getStatusColor = () => {
    if (bill.isPaid) return 'bg-tea-500';
    if (isOverdue) return 'bg-red-500';
    if (isDueSoon) return 'bg-amber-500';
    return 'bg-tea-500';
  };

  const getDueLabel = () => {
    if (bill.isPaid) return 'Paid';
    if (isOverdue) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    return `${daysUntilDue} days`;
  };

  return (
    <div
      className={cn(
        'card card-padding flex items-center gap-4',
        onClick && 'cursor-pointer hover:bg-stone-50'
      )}
      onClick={onClick}
    >
      {/* Status indicator */}
      <div className={cn('w-1 h-12 rounded-full', getStatusColor())} />

      {/* Icon */}
      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center">
        <span className="text-lg">{bill.category?.icon || '📄'}</span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-900">{bill.name}</p>
        <p className="text-sm text-stone-500">
          Due: {format(bill.dueDate, 'MMM d, yyyy')}
        </p>
      </div>

      {/* Right side */}
      <div className="text-right">
        <p className="font-mono font-semibold text-stone-900">
          {formatCurrency(bill.amount)}
        </p>
        <Badge
          variant={
            bill.isPaid ? 'success' :
            isOverdue ? 'danger' :
            isDueSoon ? 'warning' : 'default'
          }
        >
          {getDueLabel()}
        </Badge>
      </div>

      {/* Action */}
      {!bill.isPaid && (
        <Button
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onMarkPaid?.();
          }}
        >
          Pay
        </Button>
      )}
    </div>
  );
}

// Bills grouped by status
interface BillListProps {
  bills: Bill[];
  onMarkPaid?: (bill: Bill) => void;
  onBillClick?: (bill: Bill) => void;
}

export function BillList({ bills, onMarkPaid, onBillClick }: BillListProps) {
  const today = new Date();

  const overdue = bills.filter(
    (b) => !b.isPaid && differenceInDays(b.dueDate, today) < 0
  );
  const dueSoon = bills.filter(
    (b) => !b.isPaid && differenceInDays(b.dueDate, today) >= 0 && differenceInDays(b.dueDate, today) <= 7
  );
  const upcoming = bills.filter(
    (b) => !b.isPaid && differenceInDays(b.dueDate, today) > 7
  );

  const renderSection = (title: string, items: Bill[], variant: 'danger' | 'warning' | 'default') => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <div className="section-header">
          <h3 className="section-title">{title} ({items.length})</h3>
        </div>
        <div className="space-y-2">
          {items.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onMarkPaid={() => onMarkPaid?.(bill)}
              onClick={() => onBillClick?.(bill)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderSection('Overdue', overdue, 'danger')}
      {renderSection('Due This Week', dueSoon, 'warning')}
      {renderSection('Upcoming', upcoming, 'default')}
    </div>
  );
}
