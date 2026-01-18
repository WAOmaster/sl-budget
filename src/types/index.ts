// SL Budget - Firestore Data Models
// Designed for Sri Lankan personal finance with SMS integration

export type TransactionSource = 'sms' | 'manual' | 'csv' | 'pdf';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type BillFrequency = 'one_time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';
export type Language = 'en' | 'si' | 'ta';

// ============ TRANSACTION ============
export interface Transaction {
  id: string;
  userId: string;
  source: TransactionSource;
  type: TransactionType;
  amount: number;
  currency: string;
  category: string;
  categoryId?: string;
  merchant?: string;
  description?: string;
  notes?: string;
  bank?: string;
  cardLast4?: string;
  balance?: number;
  rawMessage?: string;
  simNumber?: number;
  needsReview?: boolean;
  isRecurring?: boolean;
  tags?: string[];
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  currency?: string;
  category: string;
  categoryId?: string;
  merchant?: string;
  description?: string;
  notes?: string;
  bank?: string;
  timestamp?: Date;
  isRecurring?: boolean;
  tags?: string[];
}

export interface TransactionFilters {
  userId?: string;
  type?: TransactionType;
  category?: string;
  source?: TransactionSource;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  merchant?: string;
  needsReview?: boolean;
  limit?: number;
}

// ============ CATEGORY ============
export interface Category {
  id: string;
  userId: string;
  name: string;
  nameSi?: string;
  nameTa?: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
  parentId?: string;
  budget?: number;
  isDefault?: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryInput {
  name: string;
  nameSi?: string;
  nameTa?: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
  parentId?: string;
  budget?: number;
}

// ============ BILL ============
export interface Bill {
  id: string;
  userId: string;
  name: string;
  nameSi?: string;
  nameTa?: string;
  amount: number;
  currency: string;
  dueDate: Date;
  frequency: BillFrequency;
  categoryId?: string;
  category?: string;
  merchant?: string;
  accountNumber?: string;
  isPaid: boolean;
  paidDate?: Date;
  paidAmount?: number;
  reminderEnabled: boolean;
  reminderDaysBefore: number;
  notes?: string;
  autoPay?: boolean;
  lastPaidDate?: Date;
  nextDueDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillInput {
  name: string;
  nameSi?: string;
  nameTa?: string;
  amount: number;
  dueDate: Date;
  frequency: BillFrequency;
  categoryId?: string;
  category?: string;
  merchant?: string;
  accountNumber?: string;
  reminderEnabled?: boolean;
  reminderDaysBefore?: number;
  notes?: string;
  autoPay?: boolean;
}

// ============ BUDGET ============
export interface Budget {
  id: string;
  userId: string;
  name: string;
  categoryId?: string;
  category?: string;
  amount: number;
  spent: number;
  currency: string;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  alertThreshold: number; // percentage (0-100)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetInput {
  name: string;
  categoryId?: string;
  category?: string;
  amount: number;
  period: BudgetPeriod;
  startDate?: Date;
  alertThreshold?: number;
}

// ============ USER PROFILE ============
export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  language: Language;
  currency: string;
  timezone: string;
  monthStartDay: number; // 1-28
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsIntegrationEnabled: boolean;
  defaultCategories: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfileInput {
  displayName?: string;
  language?: Language;
  currency?: string;
  timezone?: string;
  monthStartDay?: number;
  notificationsEnabled?: boolean;
}

// ============ AI INSIGHT ============
export interface AIInsight {
  id: string;
  userId: string;
  type: 'spending_trend' | 'savings_tip' | 'anomaly' | 'prediction' | 'budget_alert';
  title: string;
  titleSi?: string;
  titleTa?: string;
  content: string;
  contentSi?: string;
  contentTa?: string;
  data?: Record<string, unknown>;
  provider: 'gemini' | 'claude';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  isDismissed: boolean;
  actionUrl?: string;
  expiresAt?: Date;
  createdAt: Date;
}

// ============ UPLOAD HISTORY ============
export interface UploadHistory {
  id: string;
  userId: string;
  fileName: string;
  fileType: 'csv' | 'pdf';
  fileSize: number;
  bank?: string;
  recordsTotal: number;
  recordsProcessed: number;
  recordsFailed: number;
  status: 'processing' | 'completed' | 'failed' | 'partial';
  errorMessage?: string;
  transactionIds: string[];
  createdAt: Date;
  completedAt?: Date;
}

// ============ SAVINGS GOAL ============
export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  nameSi?: string;
  nameTa?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate?: Date;
  icon?: string;
  color?: string;
  isCompleted: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============ STATISTICS ============
export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  avgExpense: number;
  avgIncome: number;
  byCategory: Record<string, number>;
  bySource: Record<TransactionSource, number>;
  byDay: { date: string; income: number; expense: number }[];
  topMerchants: { merchant: string; amount: number; count: number }[];
}

export interface DashboardStats {
  currentMonth: TransactionStats;
  previousMonth: TransactionStats;
  changePercent: {
    income: number;
    expense: number;
    balance: number;
  };
  upcomingBills: Bill[];
  budgetStatus: {
    budget: Budget;
    spent: number;
    remaining: number;
    percentUsed: number;
  }[];
  recentTransactions: Transaction[];
  insights: AIInsight[];
}

// ============ API RESPONSES ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
