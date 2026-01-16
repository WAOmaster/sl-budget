import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  categoryIcon: string;
  description: string;
  date: Date;
  bank?: string;
  paymentMethod?: string;
}

export interface Budget {
  id: string;
  category: string;
  categoryIcon: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  frequency: 'one_time' | 'monthly' | 'quarterly' | 'yearly';
  isPaid: boolean;
  category?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
}

export interface UserPreferences {
  language: 'en' | 'si' | 'ta';
  currency: string;
  darkMode: boolean;
  notifications: {
    billReminders: boolean;
    budgetAlerts: boolean;
    weeklySummary: boolean;
  };
}

interface AppState {
  // User
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  preferences: UserPreferences;

  // Data
  transactions: Transaction[];
  budgets: Budget[];
  bills: Bill[];
  savingsGoals: SavingsGoal[];

  // UI State
  isLoading: boolean;
  error: string | null;

  // Actions - User
  setUser: (user: AppState['user']) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  toggleDarkMode: () => void;

  // Actions - Transactions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Actions - Budgets
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, data: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;

  // Actions - Bills
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateBill: (id: string, data: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  markBillPaid: (id: string) => void;

  // Actions - Savings
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateSavingsGoal: (id: string, data: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  addToSavings: (id: string, amount: number) => void;

  // Actions - UI
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Default mock data
const defaultTransactions: Transaction[] = [
  {
    id: '1',
    amount: 3450,
    type: 'expense',
    category: 'Groceries',
    categoryIcon: '🛒',
    description: 'Keells Super',
    date: new Date(),
    bank: 'Commercial Bank',
  },
  {
    id: '2',
    amount: 2100,
    type: 'expense',
    category: 'Transport',
    categoryIcon: '⛽',
    description: 'Lanka IOC',
    date: new Date(),
    bank: 'Commercial Bank',
  },
  {
    id: '3',
    amount: 85000,
    type: 'income',
    category: 'Salary',
    categoryIcon: '💰',
    description: 'Monthly Salary',
    date: new Date(Date.now() - 86400000),
    bank: 'Commercial Bank',
  },
];

const defaultBudgets: Budget[] = [
  { id: '1', category: 'Food & Dining', categoryIcon: '🍔', limit: 20000, spent: 12500, period: 'monthly' },
  { id: '2', category: 'Transport', categoryIcon: '🚌', limit: 15000, spent: 8500, period: 'monthly' },
  { id: '3', category: 'Shopping', categoryIcon: '🛍️', limit: 10000, spent: 9500, period: 'monthly' },
  { id: '4', category: 'Entertainment', categoryIcon: '🎬', limit: 5000, spent: 2100, period: 'monthly' },
];

const defaultBills: Bill[] = [
  { id: '1', name: 'Electricity - CEB', amount: 4500, dueDate: new Date(Date.now() + 3 * 86400000), frequency: 'monthly', isPaid: false },
  { id: '2', name: 'Water - NWSDB', amount: 1200, dueDate: new Date(Date.now() - 5 * 86400000), frequency: 'monthly', isPaid: false },
  { id: '3', name: 'Dialog Mobile', amount: 2800, dueDate: new Date(Date.now() + 8 * 86400000), frequency: 'monthly', isPaid: false },
  { id: '4', name: 'Internet - SLT Fiber', amount: 2999, dueDate: new Date(Date.now() + 6 * 86400000), frequency: 'monthly', isPaid: false },
];

const defaultSavingsGoals: SavingsGoal[] = [
  { id: '1', name: 'Arugam Bay Trip', icon: '🏖️', targetAmount: 75000, currentAmount: 45000, deadline: new Date('2026-04-15') },
  { id: '2', name: 'New Laptop', icon: '💻', targetAmount: 250000, currentAmount: 80000, deadline: new Date('2026-06-01') },
  { id: '3', name: 'Emergency Fund', icon: '🏦', targetAmount: 500000, currentAmount: 125000 },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial State
      user: {
        id: 'demo-user',
        name: 'Sashi',
        email: 'waoearth2013@gmail.com',
      },
      preferences: {
        language: 'en',
        currency: 'LKR',
        darkMode: false,
        notifications: {
          billReminders: true,
          budgetAlerts: true,
          weeklySummary: false,
        },
      },
      transactions: defaultTransactions,
      budgets: defaultBudgets,
      bills: defaultBills,
      savingsGoals: defaultSavingsGoals,
      isLoading: false,
      error: null,

      // User Actions
      setUser: (user) => set({ user }),
      updatePreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),
      toggleDarkMode: () =>
        set((state) => {
          const newDarkMode = !state.preferences.darkMode;
          // Toggle dark class on document
          if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', newDarkMode);
          }
          return {
            preferences: { ...state.preferences, darkMode: newDarkMode },
          };
        }),

      // Transaction Actions
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { ...transaction, id: generateId() },
            ...state.transactions,
          ],
        })),
      updateTransaction: (id, data) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      // Budget Actions
      addBudget: (budget) =>
        set((state) => ({
          budgets: [...state.budgets, { ...budget, id: generateId() }],
        })),
      updateBudget: (id, data) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
        })),
      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),

      // Bill Actions
      addBill: (bill) =>
        set((state) => ({
          bills: [...state.bills, { ...bill, id: generateId() }],
        })),
      updateBill: (id, data) =>
        set((state) => ({
          bills: state.bills.map((b) => (b.id === id ? { ...b, ...data } : b)),
        })),
      deleteBill: (id) =>
        set((state) => ({
          bills: state.bills.filter((b) => b.id !== id),
        })),
      markBillPaid: (id) =>
        set((state) => ({
          bills: state.bills.map((b) =>
            b.id === id ? { ...b, isPaid: true } : b
          ),
        })),

      // Savings Actions
      addSavingsGoal: (goal) =>
        set((state) => ({
          savingsGoals: [...state.savingsGoals, { ...goal, id: generateId() }],
        })),
      updateSavingsGoal: (id, data) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.map((g) =>
            g.id === id ? { ...g, ...data } : g
          ),
        })),
      deleteSavingsGoal: (id) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.filter((g) => g.id !== id),
        })),
      addToSavings: (id, amount) =>
        set((state) => ({
          savingsGoals: state.savingsGoals.map((g) =>
            g.id === id
              ? { ...g, currentAmount: g.currentAmount + amount }
              : g
          ),
        })),

      // UI Actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'sl-budget-storage',
      partialize: (state) => ({
        user: state.user,
        preferences: state.preferences,
        transactions: state.transactions,
        budgets: state.budgets,
        bills: state.bills,
        savingsGoals: state.savingsGoals,
      }),
    }
  )
);

// Selector hooks for better performance
export const useTransactions = () => useAppStore((state) => state.transactions);
export const useBudgets = () => useAppStore((state) => state.budgets);
export const useBills = () => useAppStore((state) => state.bills);
export const useSavingsGoals = () => useAppStore((state) => state.savingsGoals);
export const usePreferences = () => useAppStore((state) => state.preferences);
export const useUser = () => useAppStore((state) => state.user);
