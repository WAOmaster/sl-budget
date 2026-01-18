# SL Budget - Firestore Database Schema

## Overview

This document describes the Firestore database schema for SL Budget, a personal finance app for Sri Lanka with SMS integration.

## Collections

### 1. `transactions` (Existing - from SMS webhook)

Primary collection for all financial transactions (SMS & manual).

```typescript
{
  id: string;                    // Auto-generated
  userId: string;                // User identifier
  source: 'sms' | 'manual' | 'csv' | 'pdf';
  type: 'income' | 'expense' | 'transfer';
  amount: number;                // Transaction amount
  currency: string;              // 'LKR' default
  category: string;              // Category name
  categoryId?: string;           // Reference to categories collection
  merchant?: string;             // Merchant/payee name
  description?: string;          // User description
  notes?: string;                // Additional notes
  bank?: string;                 // Bank name
  cardLast4?: string;            // Last 4 digits of card
  balance?: number;              // Account balance after transaction
  rawMessage?: string;           // Original SMS message
  simNumber?: number;            // SIM slot (for dual SIM)
  needsReview?: boolean;         // Needs user categorization
  isRecurring?: boolean;         // Recurring transaction flag
  tags?: string[];               // Custom tags
  timestamp: Timestamp;          // Transaction date/time
  createdAt: Timestamp;          // Record creation time
  updatedAt: Timestamp;          // Last update time
}
```

**Indexes Required:**
- `timestamp` (desc) - For recent transactions
- `userId + timestamp` (compound) - For user queries
- `needsReview + timestamp` - For review queue

---

### 2. `categories`

Expense and income categories with Sri Lankan localization.

```typescript
{
  id: string;
  userId: string;
  name: string;                  // English name
  nameSi?: string;               // Sinhala name
  nameTa?: string;               // Tamil name
  icon: string;                  // Emoji icon
  color: string;                 // Hex color code
  type: 'income' | 'expense' | 'both';
  parentId?: string;             // For subcategories
  budget?: number;               // Category budget limit
  isDefault: boolean;            // Default category flag
  isActive: boolean;             // Soft delete flag
  sortOrder: number;             // Display order
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Default Categories (Sri Lankan Context):**
- Food & Dining (ආහාර / உணவு)
- Groceries (සිල්ලර භාණ්ඩ / மளிகை)
- Transportation (ප්‍රවාහනය / போக்குவரத்து)
- Fuel (ඉන්ධන / எரிபொருள்)
- Utilities (CEB, NWSDB)
- Mobile & Internet (Dialog, Mobitel, SLT)
- Donations & Temple (පූජා/දන්සැල / கோயில்/தானம்)

---

### 3. `bills`

Recurring bills and reminders.

```typescript
{
  id: string;
  userId: string;
  name: string;
  nameSi?: string;
  nameTa?: string;
  amount: number;
  currency: string;
  dueDate: Timestamp;
  frequency: 'one_time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  categoryId?: string;
  category?: string;
  merchant?: string;             // CEB, NWSDB, Dialog, etc.
  accountNumber?: string;        // Account/reference number
  isPaid: boolean;
  paidDate?: Timestamp;
  paidAmount?: number;
  reminderEnabled: boolean;
  reminderDaysBefore: number;    // Default: 3 days
  notes?: string;
  autoPay?: boolean;
  lastPaidDate?: Timestamp;
  nextDueDate?: Timestamp;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 4. `budgets`

Spending budgets by category or overall.

```typescript
{
  id: string;
  userId: string;
  name: string;
  categoryId?: string;
  category?: string;
  amount: number;                // Budget limit
  spent: number;                 // Current spending (calculated)
  currency: string;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Timestamp;
  endDate: Timestamp;
  alertThreshold: number;        // Percentage (0-100)
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 5. `users`

User profiles and preferences.

```typescript
{
  id: string;                    // Firebase Auth UID
  email: string;
  displayName?: string;
  photoURL?: string;
  language: 'en' | 'si' | 'ta';
  currency: string;              // Default: 'LKR'
  timezone: string;              // Default: 'Asia/Colombo'
  monthStartDay: number;         // 1-28 (for budget periods)
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsIntegrationEnabled: boolean;
  defaultCategories: string[];   // Selected default categories
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 6. `ai_insights`

AI-generated financial insights.

```typescript
{
  id: string;
  userId: string;
  type: 'spending_trend' | 'savings_tip' | 'anomaly' | 'prediction' | 'budget_alert';
  title: string;
  titleSi?: string;
  titleTa?: string;
  content: string;
  contentSi?: string;
  contentTa?: string;
  data?: object;                 // Structured data for visualization
  provider: 'gemini' | 'claude';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  isDismissed: boolean;
  actionUrl?: string;
  expiresAt?: Timestamp;
  createdAt: Timestamp;
}
```

---

### 7. `upload_history`

File upload tracking (CSV/PDF bank statements).

```typescript
{
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
  transactionIds: string[];      // Created transaction IDs
  createdAt: Timestamp;
  completedAt?: Timestamp;
}
```

---

### 8. `savings_goals`

Savings targets and progress.

```typescript
{
  id: string;
  userId: string;
  name: string;
  nameSi?: string;
  nameTa?: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  targetDate?: Timestamp;
  icon?: string;
  color?: string;
  isCompleted: boolean;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Transactions - read/write own data only
    match /transactions/{docId} {
      allow read, write: if isOwner(resource.data.userId);
      allow create: if isAuthenticated();
    }
    
    // Categories
    match /categories/{docId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(resource.data.userId);
    }
    
    // Bills
    match /bills/{docId} {
      allow read, write: if isOwner(resource.data.userId);
    }
    
    // Budgets
    match /budgets/{docId} {
      allow read, write: if isOwner(resource.data.userId);
    }
    
    // Users - own profile only
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // AI Insights
    match /ai_insights/{docId} {
      allow read: if isOwner(resource.data.userId);
      allow write: if false; // Only server can write
    }
    
    // Upload History
    match /upload_history/{docId} {
      allow read, write: if isOwner(resource.data.userId);
    }
    
    // Savings Goals
    match /savings_goals/{docId} {
      allow read, write: if isOwner(resource.data.userId);
    }
  }
}
```

---

## API Endpoints Summary

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/transactions` | GET, POST, PUT, DELETE | Transaction CRUD |
| `/api/categories` | GET, POST, PUT, DELETE | Category management |
| `/api/bills` | GET, POST, PUT, DELETE | Bill management |
| `/api/budgets` | GET, POST, PUT, DELETE | Budget management |
| `/api/stats` | GET | Dashboard statistics |

---

## Deployment Steps

### 1. Set Environment Variables in Vercel

```bash
# Required
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=budget-buddy-1e3e8.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=budget-buddy-1e3e8
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=budget-buddy-1e3e8.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_DEFAULT_USER_ID=default_user
```

### 2. Deploy to Vercel

Push to GitHub and Vercel will auto-deploy.

### 3. Initialize Default Categories

After deployment, call:
```
POST /api/categories
{ "action": "initializeDefaults" }
```

---

## Existing Firebase Functions

These are already deployed and working:

| Function | URL |
|----------|-----|
| SMS Webhook | `https://us-central1-budget-buddy-1e3e8.cloudfunctions.net/smsWebhook` |
| Get Transactions | `https://us-central1-budget-buddy-1e3e8.cloudfunctions.net/getTransactions` |
| Get Stats | `https://us-central1-budget-buddy-1e3e8.cloudfunctions.net/getStats` |
