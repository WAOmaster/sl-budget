'use client';

import { formatCurrency, formatRelativeDate, cn } from '@/lib/utils';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category?: {
    name: string;
    icon: string;
  };
  date: Date;
  bank?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
}

export function TransactionCard({ transaction, onClick }: TransactionCardProps) {
  const isIncome = transaction.type === 'income';

  return (
    <div className="transaction-card" onClick={onClick}>
      {/* Category Icon */}
      <div className="transaction-icon">
        <span className="text-lg">
          {transaction.category?.icon || (isIncome ? '💰' : '📋')}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-900 truncate">
          {transaction.description}
        </p>
        <p className="text-sm text-stone-500">
          {transaction.category?.name || 'Uncategorized'}
          {transaction.bank && (
            <span className="text-stone-400"> • {transaction.bank}</span>
          )}
        </p>
      </div>

      {/* Amount & Date */}
      <div className="text-right">
        <p className={cn(
          'font-mono font-semibold',
          isIncome ? 'text-tea-600' : 'text-stone-900'
        )}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
        </p>
        <p className="text-xs text-stone-400">
          {formatRelativeDate(transaction.date)}
        </p>
      </div>
    </div>
  );
}

// List wrapper
interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onTransactionClick }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="empty-state py-8">
        <div className="empty-state-icon">
          <span className="text-2xl">📋</span>
        </div>
        <h3 className="empty-state-title">No transactions yet</h3>
        <p className="empty-state-description">
          Your transactions will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onClick={() => onTransactionClick?.(transaction)}
        />
      ))}
    </div>
  );
}
