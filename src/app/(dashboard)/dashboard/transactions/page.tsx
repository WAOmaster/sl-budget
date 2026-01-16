'use client';

import { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button, Input, Select, Badge } from '@/components/ui';
import { TransactionList, Transaction } from '@/components/transactions';
import { formatCurrency } from '@/lib/utils';

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Keells Super',
    amount: 3450,
    type: 'expense',
    category: { name: 'Groceries', icon: '🛒' },
    date: new Date(),
    bank: 'Commercial Bank',
  },
  {
    id: '2',
    description: 'Lanka IOC',
    amount: 2100,
    type: 'expense',
    category: { name: 'Fuel', icon: '⛽' },
    date: new Date(),
    bank: 'Sampath Bank',
  },
  {
    id: '3',
    description: 'Salary - January',
    amount: 85000,
    type: 'income',
    category: { name: 'Salary', icon: '💰' },
    date: new Date(Date.now() - 86400000),
  },
  {
    id: '4',
    description: 'Dialog Bill',
    amount: 2800,
    type: 'expense',
    category: { name: 'Bills', icon: '📱' },
    date: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: '5',
    description: 'Uber Ride',
    amount: 650,
    type: 'expense',
    category: { name: 'Transport', icon: '🚗' },
    date: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: '6',
    description: 'Coffee Bean',
    amount: 1200,
    type: 'expense',
    category: { name: 'Food & Dining', icon: '☕' },
    date: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: '7',
    description: 'Freelance Project',
    amount: 25000,
    type: 'income',
    category: { name: 'Business', icon: '💼' },
    date: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: '8',
    description: 'Netflix Subscription',
    amount: 1490,
    type: 'expense',
    category: { name: 'Entertainment', icon: '🎬' },
    date: new Date(Date.now() - 86400000 * 7),
  },
];

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesFilter = filter === 'all' || t.type === filter;
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalIncome = mockTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = mockTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Transactions"
        subtitle="All your income and expenses"
        action={
          <Button variant="secondary" size="sm">
            <Download size={16} />
            Export
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card card-padding">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Total Income</p>
          <p className="font-mono text-xl font-semibold text-tea-600">
            +{formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="card card-padding">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Total Expenses</p>
          <p className="font-mono text-xl font-semibold text-stone-900">
            -{formatCurrency(totalExpense)}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'income'
                ? 'bg-tea-500 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'expense'
                ? 'bg-cinnamon-500 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Expense
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="card">
        <TransactionList
          transactions={filteredTransactions}
          onTransactionClick={(t) => console.log('Clicked:', t)}
        />
      </div>
    </div>
  );
}
