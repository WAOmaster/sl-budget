'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout';
import { Card, Select, Badge } from '@/components/ui';
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Mock data for charts
const monthlyData = [
  { month: 'Aug', income: 85000, expenses: 62000 },
  { month: 'Sep', income: 85000, expenses: 58000 },
  { month: 'Oct', income: 90000, expenses: 71000 },
  { month: 'Nov', income: 85000, expenses: 65000 },
  { month: 'Dec', income: 95000, expenses: 82000 },
  { month: 'Jan', income: 85000, expenses: 42300 },
];

const categoryData = [
  { name: 'Food & Dining', value: 12500, color: '#f97316' },
  { name: 'Transport', value: 8500, color: '#3b82f6' },
  { name: 'Shopping', value: 7200, color: '#ec4899' },
  { name: 'Bills', value: 15000, color: '#78716c' },
  { name: 'Entertainment', value: 4100, color: '#f43f5e' },
  { name: 'Other', value: 5000, color: '#a8a29e' },
];

const weeklySpending = [
  { day: 'Mon', amount: 2500 },
  { day: 'Tue', amount: 1800 },
  { day: 'Wed', amount: 3200 },
  { day: 'Thu', amount: 2100 },
  { day: 'Fri', amount: 4500 },
  { day: 'Sat', amount: 6200 },
  { day: 'Sun', amount: 3100 },
];

const topMerchants = [
  { name: 'Keells Super', amount: 8500, count: 12 },
  { name: 'Lanka IOC', amount: 6200, count: 8 },
  { name: 'Dialog', amount: 2800, count: 1 },
  { name: 'CEB', amount: 4500, count: 1 },
  { name: 'Uber', amount: 3200, count: 15 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('this-month');

  const totalIncome = 85000;
  const totalExpenses = 42300;
  const savings = totalIncome - totalExpenses;
  const savingsRate = ((savings / totalIncome) * 100).toFixed(1);

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Analytics"
        subtitle="Understand your spending patterns"
        action={
          <Select
            options={[
              { value: 'this-month', label: 'This Month' },
              { value: 'last-month', label: 'Last Month' },
              { value: '3-months', label: 'Last 3 Months' },
              { value: '6-months', label: 'Last 6 Months' },
              { value: 'year', label: 'This Year' },
            ]}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-40"
          />
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card padding className="text-center">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Income</p>
          <p className="font-mono text-xl font-bold text-tea-600">{formatCurrencyCompact(totalIncome)}</p>
          <p className="text-xs text-tea-600 flex items-center justify-center gap-1 mt-1">
            <ArrowUpRight size={12} /> 12% vs last month
          </p>
        </Card>
        <Card padding className="text-center">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Expenses</p>
          <p className="font-mono text-xl font-bold text-stone-900">{formatCurrencyCompact(totalExpenses)}</p>
          <p className="text-xs text-tea-600 flex items-center justify-center gap-1 mt-1">
            <ArrowDownRight size={12} /> 8% vs last month
          </p>
        </Card>
        <Card padding className="text-center">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Savings</p>
          <p className="font-mono text-xl font-bold text-ocean-600">{formatCurrencyCompact(savings)}</p>
          <p className="text-xs text-stone-500 mt-1">{savingsRate}% of income</p>
        </Card>
        <Card padding className="text-center">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-1">Transactions</p>
          <p className="font-mono text-xl font-bold text-stone-900">47</p>
          <p className="text-xs text-stone-500 mt-1">This month</p>
        </Card>
      </div>

      {/* Income vs Expenses Chart */}
      <Card className="mb-6" padding={false}>
        <div className="card-header">
          <h3 className="font-semibold text-stone-900">Income vs Expenses</h3>
        </div>
        <div className="p-5">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e87a1b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e87a1b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="month" stroke="#78716c" fontSize={12} />
                <YAxis stroke="#78716c" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e7e5e4',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#e87a1b"
                  strokeWidth={2}
                  fill="url(#expenseGradient)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Spending by Category */}
        <Card padding={false}>
          <div className="card-header">
            <h3 className="font-semibold text-stone-900">Spending by Category</h3>
          </div>
          <div className="p-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-stone-600 truncate">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Weekly Spending Pattern */}
        <Card padding={false}>
          <div className="card-header">
            <h3 className="font-semibold text-stone-900">Weekly Spending Pattern</h3>
          </div>
          <div className="p-5">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                  <XAxis dataKey="day" stroke="#78716c" fontSize={12} />
                  <YAxis stroke="#78716c" fontSize={12} tickFormatter={(v) => `${v / 1000}K`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e7e5e4',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="amount" fill="#e87a1b" radius={[4, 4, 0, 0]} name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-stone-500 mt-4 text-center">
              You spend most on <span className="font-medium text-cinnamon-600">Saturdays</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Top Merchants */}
      <Card padding={false}>
        <div className="card-header">
          <h3 className="font-semibold text-stone-900">Top Merchants</h3>
        </div>
        <div className="divide-y divide-stone-100">
          {topMerchants.map((merchant, idx) => (
            <div key={merchant.name} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm font-medium text-stone-600">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-medium text-stone-900">{merchant.name}</p>
                  <p className="text-sm text-stone-500">{merchant.count} transactions</p>
                </div>
              </div>
              <p className="font-mono font-semibold text-stone-900">
                {formatCurrency(merchant.amount)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Insights */}
      <Card className="mt-6" padding>
        <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-tea-500" />
          Smart Insights
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-tea-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-tea-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={16} className="text-tea-600" />
            </div>
            <div>
              <p className="font-medium text-stone-900">Great savings rate!</p>
              <p className="text-sm text-stone-600">
                You&apos;re saving {savingsRate}% of your income. That&apos;s above the recommended 20%.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-cinnamon-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-cinnamon-100 flex items-center justify-center flex-shrink-0">
              <TrendingDown size={16} className="text-cinnamon-600" />
            </div>
            <div>
              <p className="font-medium text-stone-900">Weekend spending is high</p>
              <p className="text-sm text-stone-600">
                You spend 40% more on weekends. Consider setting a weekend budget limit.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
