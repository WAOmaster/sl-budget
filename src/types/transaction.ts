// Transaction Types for Budget Buddy

export type TransactionSource = "sms" | "manual" | "csv" | "pdf";
export type TransactionType = "income" | "expense" | "transfer";
export type TransactionCategory = 
  | "purchase" | "atm" | "transfer" | "bill" | "salary" 
  | "food" | "transport" | "utilities" | "entertainment" 
  | "health" | "education" | "other";

export interface Transaction {
  id: string;
  source: TransactionSource;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency: string;
  merchant?: string;
  description?: string;
  bank?: string;
  cardLast4?: string;
  balance?: number;
  reference?: string;
  rawMessage?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionInput {
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  currency?: string;
  merchant?: string;
  description?: string;
  timestamp?: Date;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  type?: TransactionType;
  category?: TransactionCategory;
  source?: TransactionSource;
  minAmount?: number;
  maxAmount?: number;
  limit?: number;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  transactionCount: number;
  byCategory: Record<string, number>;
  bySource: Record<string, number>;
}