'use client';

import { useState } from 'react';
import { Sidebar, Header, BottomNav } from '@/components/layout';
import { AddTransactionModal } from '@/components/transactions';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="page-container">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content min-h-screen pb-20 md:pb-0">
        {/* Header */}
        <Header userName="Sashi" />

        {/* Page Content */}
        <main className="px-4 md:px-6 py-6">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav onAddClick={() => setIsAddModalOpen(true)} />

      {/* Desktop FAB */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fab hidden md:flex"
        aria-label="Add transaction"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data) => {
          console.log('New transaction:', data);
          // TODO: API call to save transaction
        }}
      />
    </div>
  );
}
