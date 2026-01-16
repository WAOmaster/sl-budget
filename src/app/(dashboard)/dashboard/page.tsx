'use client';

import Link from 'next/link';
import { ChevronRight, TrendingUp, Wallet } from 'lucide-react';
import { BalanceCard, StatsGrid } from '@/components/stats';
import { TransactionList, Transaction } from '@/components/transactions';
import { BudgetSummary, Budget } from '@/components/budgets';
import { formatCurrency } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';
import { differenceInDays } from 'date-fns';

export default function DashboardPage() {
  const { transactions, budgets, bills, user } = useAppStore();

  // Transform store data to component format
  const displayTransactions: Transaction[] = transactions.slice(0, 4).map((t) => ({
    id: t.id,
    description: t.description,
    amount: t.amount,
    type: t.type,
    category: { name: t.category, icon: t.categoryIcon },
    date: new Date(t.date),
    bank: t.bank,
  }));

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

  // Calculate stats from store data
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses + 80000; // Base balance
  const monthlyBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const budgetUsed = budgets.reduce((sum, b) => sum + b.spent, 0);

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
        income={income}
        expenses={expenses}
        savings={income - expenses}
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
          {displayTransactions.length > 0 ? (
            <TransactionList
              transactions={displayTransactions}
              onTransactionClick={(t) => console.log('Clicked:', t)}
            />
          ) : (
            <div className="p-8 text-center text-stone-500">
              No transactions yet. Add your first transaction!
            </div>
          )}
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
            {upcomingBills.map((bill) => {
              const daysUntil = differenceInDays(new Date(bill.dueDate), new Date());
              const isOverdue = daysUntil < 0;
              return (
                <div key={bill.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isOverdue ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    <span>📄</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-stone-900">{bill.name}</p>
                    <p className={`text-sm ${isOverdue ? 'text-red-500' : 'text-stone-500'}`}>
                      {isOverdue
                        ? `${Math.abs(daysUntil)} days overdue`
                        : daysUntil === 0
                        ? 'Due today'
                        : `${daysUntil} days`}
                    </p>
                  </div>
                  <p className="font-mono font-medium text-stone-900">
                    {formatCurrency(bill.amount)}
                  </p>
                </div>
              );
            })}
            {upcomingBills.length === 0 && (
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
            {displayBudgets.length > 0 ? (
              <BudgetSummary budgets={displayBudgets} />
            ) : (
              <p className="text-center text-stone-500 py-4">No budgets set</p>
            )}
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
                You&apos;re Rs. 800 under budget for electricity this month.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
