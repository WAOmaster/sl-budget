// Transaction Types for SL Budget
// Supports SMS integration + Manual entry + CSV/PDF uploads

export type TransactionSource = "sms" | "manual" | "csv" | "pdf";
export type TransactionType = "income" | "expense" | "transfer";

// Extended categories to match both SMS parsing and manual entry
export type TransactionCategory = 
  | "purchase" | "atm" | "transfer" | "bill" | "salary"
  | "food" | "groceries" | "dining"
  | "transport" | "utilities" | "entertainment"
  | "shopping" | "health" | "education"
  | "uncategorized" | "other";

// Full transaction as stored in Firestore
export interface Transaction {
  id: string;
  source: TransactionSource;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  merchant?: string;
  description?: string;
  notes?: string;
  bank?: string;
  cardLast4?: string;
  balance?: number;
  reference?: string;
  rawMessage?: string;       // Only for SMS
  simNumber?: number;        // Only for SMS
  needsReview?: boolean;
  isRecurring?: boolean;
  tags?: string[];
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Input for creating manual transactions (source added by lib)
export interface TransactionInput {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency?: string;
  merchant?: string;
  description?: string;
  notes?: string;
  bank?: string;
  timestamp?: Date;
  isRecurring?: boolean;
  tags?: string[];
}

// Filters for querying transactions
export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: TransactionType;
  category?: TransactionCategory;
  source?: TransactionSource;
  minAmount?: number;
  maxAmount?: number;
  merchant?: string;
  needsReview?: boolean;
  limit?: number;
}

// Statistics summary
export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
  byCategory: Record<string, number>;
  bySource: Record<string, number>;
}
