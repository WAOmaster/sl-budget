'use client';

import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import { BillList, Bill } from '@/components/bills';
import { formatCurrency } from '@/lib/utils';

// Mock data
const mockBills: Bill[] = [
  {
    id: '1',
    name: 'Water Bill - NWSDB',
    amount: 1200,
    dueDate: new Date(Date.now() - 86400000 * 5), // 5 days overdue
    frequency: 'monthly',
    isPaid: false,
    category: { icon: '💧' },
  },
  {
    id: '2',
    name: 'Electricity - CEB',
    amount: 4500,
    dueDate: new Date(Date.now() + 86400000 * 3),
    frequency: 'monthly',
    isPaid: false,
    category: { icon: '⚡' },
  },
  {
    id: '3',
    name: 'Internet - SLT Fiber',
    amount: 2999,
    dueDate: new Date(Date.now() + 86400000 * 6),
    frequency: 'monthly',
    isPaid: false,
    category: { icon: '🌐' },
  },
  {
    id: '4',
    name: 'Dialog Mobile',
    amount: 2800,
    dueDate: new Date(Date.now() + 86400000 * 8),
    frequency: 'monthly',
    isPaid: false,
    category: { icon: '📱' },
  },
  {
    id: '5',
    name: 'Rent',
    amount: 35000,
    dueDate: new Date(Date.now() + 86400000 * 20),
    frequency: 'monthly',
    isPaid: false,
    category: { icon: '🏠' },
  },
  {
    id: '6',
    name: 'Netflix',
    amount: 1490,
    dueDate: new Date(Date.now() + 86400000 * 12),
    frequency: 'monthly',
    isPaid: true,
    category: { icon: '🎬' },
  },
];

export default function BillsPage() {
  const unpaidBills = mockBills.filter((b) => !b.isPaid);
  const totalDue = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Bills & Payments"
        subtitle="Manage your recurring bills"
        action={
          <Button variant="primary" size="sm">
            <Plus size={16} />
            Add Bill
          </Button>
        }
      />

      {/* Summary */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-amber-500 to-cinnamon-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">Total Due This Month</p>
            <p className="font-mono text-3xl font-bold">{formatCurrency(totalDue)}</p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm mb-1">Bills Pending</p>
            <p className="text-2xl font-bold">{unpaidBills.length}</p>
          </div>
        </div>
      </div>

      {/* Bill List */}
      <BillList
        bills={mockBills}
        onMarkPaid={(bill) => console.log('Mark paid:', bill)}
        onBillClick={(bill) => console.log('Clicked:', bill)}
      />

      {/* Empty State */}
      {mockBills.length === 0 && (
        <div className="empty-state card py-12">
          <div className="empty-state-icon">
            <span className="text-3xl">📄</span>
          </div>
          <h3 className="empty-state-title">No bills yet</h3>
          <p className="empty-state-description">
            Add your recurring bills to never miss a payment
          </p>
          <Button variant="primary">
            <Plus size={16} />
            Add Bill
          </Button>
        </div>
      )}
    </div>
  );
}
