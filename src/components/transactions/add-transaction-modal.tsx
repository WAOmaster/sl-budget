'use client';

import { useState } from 'react';
import { Modal, Button, Input, CurrencyInput, Select } from '@/components/ui';
import { defaultCategories, sriLankanBanks } from '@/lib/utils';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: TransactionFormData) => void;
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  bank: string;
}

export function AddTransactionModal({ isOpen, onClose, onSubmit }: AddTransactionModalProps) {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [bank, setBank] = useState('');

  const categories = defaultCategories
    .filter((c) => c.type === type)
    .map((c) => ({
      value: c.name,
      label: c.name,
      icon: c.icon,
    }));

  const banks = [
    { value: 'cash', label: 'Cash' },
    ...sriLankanBanks.map((b) => ({ value: b.id, label: b.name })),
  ];

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  const handleSubmit = () => {
    onSubmit?.({
      type,
      amount,
      category,
      description,
      date,
      bank,
    });
    // Reset form
    setAmount(0);
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setBank('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Transaction"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={amount === 0 || !category}
            className="flex-1"
          >
            Save Entry
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Type Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
              type === 'expense'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
              type === 'income'
                ? 'bg-tea-500 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount */}
        <CurrencyInput
          label="Amount"
          value={amount}
          onValueChange={setAmount}
          placeholder="0.00"
        />

        {/* Quick Amount Buttons */}
        <div className="flex flex-wrap gap-2">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setAmount(amt)}
              className="quick-amount-btn"
            >
              Rs. {amt.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Category */}
        <Select
          label="Category"
          options={categories}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Select category"
        />

        {/* Description */}
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this for?"
        />

        {/* Date & Bank Row */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Select
            label="Payment Method"
            options={banks}
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            placeholder="Select"
          />
        </div>
      </div>
    </Modal>
  );
}
