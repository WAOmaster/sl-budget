import { type ClassValue, clsx } from 'clsx';

// Simple cn utility without tailwind-merge to keep dependencies minimal
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format currency in Sri Lankan Rupees
export function formatCurrency(amount: number, showSign = false): string {
  const formatted = new Intl.NumberFormat('en-LK', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  const prefix = showSign ? (amount >= 0 ? '+ ' : '- ') : '';
  return `${prefix}Rs. ${formatted}`;
}

// Format compact currency for large numbers
export function formatCurrencyCompact(amount: number): string {
  if (Math.abs(amount) >= 1000000) {
    return `Rs. ${(amount / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1000) {
    return `Rs. ${(amount / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}

// Format date relative to today
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-LK', {
      month: 'short',
      day: 'numeric',
    });
  }
}

// Format date for display
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  if (format === 'short') {
    return date.toLocaleDateString('en-LK', {
      month: 'short',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString('en-LK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Calculate percentage
export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(Math.round((current / total) * 100), 100);
}

// Get progress bar color based on percentage
export function getProgressColor(percentage: number): 'success' | 'warning' | 'danger' | 'default' {
  if (percentage >= 90) return 'danger';
  if (percentage >= 70) return 'warning';
  if (percentage >= 50) return 'default';
  return 'success';
}

// Get greeting based on time of day
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Category icons mapping
export const categoryIcons: Record<string, string> = {
  food: '🍔',
  groceries: '🛒',
  transport: '🚌',
  fuel: '⛽',
  shopping: '🛍️',
  entertainment: '🎬',
  health: '💊',
  education: '📚',
  bills: '📄',
  rent: '🏠',
  salary: '💰',
  business: '💼',
  investment: '📈',
  gift: '🎁',
  travel: '✈️',
  other: '📋',
};

// Sri Lankan banks
export const sriLankanBanks = [
  { id: 'commercial', name: 'Commercial Bank', code: 'COMB' },
  { id: 'sampath', name: 'Sampath Bank', code: 'SAMP' },
  { id: 'hnb', name: 'Hatton National Bank', code: 'HNB' },
  { id: 'boc', name: 'Bank of Ceylon', code: 'BOC' },
  { id: 'peoples', name: "People's Bank", code: 'PB' },
  { id: 'seylan', name: 'Seylan Bank', code: 'SEYL' },
  { id: 'ndb', name: 'NDB Bank', code: 'NDB' },
  { id: 'dfcc', name: 'DFCC Bank', code: 'DFCC' },
  { id: 'nations', name: 'Nations Trust Bank', code: 'NTB' },
  { id: 'panasia', name: 'Pan Asia Bank', code: 'PABC' },
  { id: 'union', name: 'Union Bank', code: 'UB' },
  { id: 'amana', name: 'Amana Bank', code: 'AMANA' },
  { id: 'hsbc', name: 'HSBC', code: 'HSBC' },
  { id: 'sc', name: 'Standard Chartered', code: 'SCB' },
  { id: 'citi', name: 'Citi Bank', code: 'CITI' },
] as const;

// Default categories
export const defaultCategories = [
  { name: 'Food & Dining', icon: '🍔', type: 'expense', color: '#f97316' },
  { name: 'Groceries', icon: '🛒', type: 'expense', color: '#22c55e' },
  { name: 'Transport', icon: '🚌', type: 'expense', color: '#3b82f6' },
  { name: 'Fuel', icon: '⛽', type: 'expense', color: '#8b5cf6' },
  { name: 'Shopping', icon: '🛍️', type: 'expense', color: '#ec4899' },
  { name: 'Entertainment', icon: '🎬', type: 'expense', color: '#f43f5e' },
  { name: 'Health', icon: '💊', type: 'expense', color: '#14b8a6' },
  { name: 'Education', icon: '📚', type: 'expense', color: '#6366f1' },
  { name: 'Bills & Utilities', icon: '📄', type: 'expense', color: '#78716c' },
  { name: 'Rent', icon: '🏠', type: 'expense', color: '#a855f7' },
  { name: 'Salary', icon: '💰', type: 'income', color: '#22c55e' },
  { name: 'Business', icon: '💼', type: 'income', color: '#3b82f6' },
  { name: 'Investment', icon: '📈', type: 'income', color: '#14b8a6' },
  { name: 'Gift', icon: '🎁', type: 'income', color: '#f43f5e' },
  { name: 'Other', icon: '📋', type: 'expense', color: '#78716c' },
];
