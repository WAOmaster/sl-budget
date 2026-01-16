'use client';

import Link from 'next/link';
import { ChevronRight, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { BalanceCard, StatsGrid } from '@/components/stats';
import { TransactionList, Transaction } from '@/components/transactions';
import { BudgetSummary, Budget } from '@/components/budgets';
import { Bill } from '@/components/bills';
import { formatCurrency } from '@/lib/utils';
import { differenceInDays } from 'date-fns';

// Mock data - replace with real API calls
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
];

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
];

const mockBills: Bill[] = [
  {
    id: '1',
    name: 'Electricity - CEB',
    amount: 4500,
    dueDate: new Date(Date.now() + 86400000 * 3),
    frequency: 'monthly',
    isPaid: false,
    category: { icon: '⚡' },
  },
  {
    id: '2',
    name: 'Internet - SLT Fiber',
    amount: 2999,
    dueDate: new Date(Date.now() + 86400000 * 6),
    frequency: 'monthly',
    isPaid: false,
    category: { icon: '🌐' },
  },
];

export default function DashboardPage() {
  // Calculate mock stats
  const balance = 125430;
  const monthlyBudget = 75000;
  const budgetUsed = 42300;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Balance Card */}
      <BalanceCard
        balance={balance}
        budgetUsed={budgetUsed}
        budgetTotal={monthlyBudget}
      />

      {/* Stats Grid */}
      <StatsGrid
        income={85000}
        expenses={42300}
        savings={15000}
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
        <div className="card">
          <TransactionList
            transactions={mockTransactions.slice(0, 4)}
            onTransactionClick={(t) => console.log('Clicked:', t)}
          />
        </div>
      </section>

      {/* Two Column Layout for Desktop */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Bills */}
        <section>
          <div className="section-header">
            <h2 className="section-title">Upcoming Bills</h2>
            <Link href="/dashboard/bills" className="section-action flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="card card-padding space-y-3">
            {mockBills.map((bill) => {
              const daysUntil = differenceInDays(bill.dueDate, new Date());
              return (
                <div key={bill.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <span>{bill.category?.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-stone-900">{bill.name}</p>
                    <p className="text-sm text-stone-500">
                      {daysUntil === 0 ? 'Due today' : `${daysUntil} days`}
                    </p>
                  </div>
                  <p className="font-mono font-medium text-stone-900">
                    {formatCurrency(bill.amount)}
                  </p>
                </div>
              );
            })}
            {mockBills.length === 0 && (
              <p className="text-center text-stone-500 py-4">No upcoming bills</p>
            )}
          </div>
        </section>

        {/* Budget Status */}
        <section>
          <div className="section-header">
            <h2 className="section-title">Budget Status</h2>
            <Link href="/dashboard/budgets" className="section-action flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="card card-padding">
            <BudgetSummary budgets={mockBudgets} />
          </div>
        </section>
      </div>

      {/* Smart Tips */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Smart Tips</h2>
        </div>
        <div className="space-y-3">
          <div className="card card-padding flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-amber-600" size={20} />
            </div>
            <div>
              <h3 className="font-medium text-stone-900">Food spending is 15% higher than last month</h3>
              <p className="text-sm text-stone-500 mt-1">
                You spent Rs. 4,200 more at restaurants. Consider meal prepping to save ~Rs. 3,000/month.
              </p>
            </div>
          </div>
          <div className="card card-padding flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-tea-100 flex items-center justify-center flex-shrink-0">
              <Wallet className="text-tea-600" size={20} />
            </div>
            <div>
              <h3 className="font-medium text-stone-900">Great job on utilities!</h3>
              <p className="text-sm text-stone-500 mt-1">
                You're Rs. 800 under budget for electricity this month.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
