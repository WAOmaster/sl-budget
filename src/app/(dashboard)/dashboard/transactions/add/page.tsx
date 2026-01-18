'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Plus, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useTransactionMutations } from '@/hooks/useTransactions';
import type { TransactionInput, TransactionCategory } from '@/types/transaction';

// Categories matching the TransactionCategory type
const categories: { id: TransactionCategory; name: string; icon: string }[] = [
  { id: 'food', name: 'Food & Dining', icon: '🍔' },
  { id: 'transport', name: 'Transport', icon: '🚗' },
  { id: 'utilities', name: 'Utilities', icon: '💡' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'purchase', name: 'Shopping', icon: '🛍️' },
  { id: 'health', name: 'Health', icon: '💊' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'salary', name: 'Salary', icon: '💰' },
  { id: 'transfer', name: 'Transfer', icon: '↔️' },
  { id: 'bill', name: 'Bills', icon: '📄' },
  { id: 'atm', name: 'ATM', icon: '🏧' },
  { id: 'other', name: 'Other', icon: '📋' },
];

export default function AddTransactionPage() {
  const router = useRouter();
  const { add, loading, error } = useTransactionMutations();
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    type: 'expense' as 'expense' | 'income',
    amount: '',
    category: '' as TransactionCategory | '',
    merchant: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.category) {
      return;
    }

    const input: TransactionInput = {
      type: formData.type,
      amount: parseFloat(formData.amount),
      currency: 'LKR',
      category: formData.category as TransactionCategory,
      merchant: formData.merchant || undefined,
      description: formData.description || formData.merchant || formData.category,
      timestamp: new Date(formData.date),
    };

    const id = await add(input);
    if (id) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/transactions');
      }, 1500);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Transaction Added!</h2>
        <p className="text-muted-foreground">Redirecting to transactions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/transactions" className="p-2 hover:bg-muted rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold">Add Transaction</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Type Toggle */}
        <div className="card p-1 flex">
          <button
            type="button"
            onClick={() => setFormData((d) => ({ ...d, type: 'expense' }))}
            className={`flex-1 py-3 rounded-lg text-center font-medium transition-colors ${
              formData.type === 'expense'
                ? 'bg-red-500 text-white'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData((d) => ({ ...d, type: 'income' }))}
            className={`flex-1 py-3 rounded-lg text-center font-medium transition-colors ${
              formData.type === 'income'
                ? 'bg-green-500 text-white'
                : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount */}
        <div className="card p-4">
          <label className="block text-sm text-muted-foreground mb-2">Amount (LKR)</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(e) => setFormData((d) => ({ ...d, amount: e.target.value }))}
            placeholder="0.00"
            className="w-full text-3xl font-bold bg-transparent border-none outline-none"
          />
        </div>

        {/* Category */}
        <div className="card p-4">
          <label className="block text-sm text-muted-foreground mb-3">Category</label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setFormData((d) => ({ ...d, category: cat.id }))}
                className={`p-3 rounded-lg text-center transition-all ${
                  formData.category === cat.id
                    ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <span className="text-xl block">{cat.icon}</span>
                <span className="text-xs mt-1 block truncate">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Merchant & Description */}
        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Merchant / Payee</label>
            <input
              type="text"
              value={formData.merchant}
              onChange={(e) => setFormData((d) => ({ ...d, merchant: e.target.value }))}
              placeholder="e.g., Cargills, Keells"
              className="w-full px-4 py-3 bg-muted rounded-lg outline-none focus:ring-2 ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Description (optional)</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData((d) => ({ ...d, description: e.target.value }))}
              placeholder="What was this for?"
              className="w-full px-4 py-3 bg-muted rounded-lg outline-none focus:ring-2 ring-primary"
            />
          </div>
        </div>

        {/* Date */}
        <div className="card p-4">
          <label className="block text-sm text-muted-foreground mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData((d) => ({ ...d, date: e.target.value }))}
            className="w-full px-4 py-3 bg-muted rounded-lg outline-none focus:ring-2 ring-primary"
          />
        </div>

        {/* Error Display */}
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">{error}</div>}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !formData.amount || !formData.category}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Plus size={20} />
              Add Transaction
            </>
          )}
        </button>
      </form>
    </div>
  );
}
