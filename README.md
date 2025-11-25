# SL Budget - AI-Powered Finance Manager

Personal finance management PWA for Sri Lanka with AI integration (Gemini & Claude).

## ✅ Migration: Supabase → Prisma Complete

**Changes Made:**
- ❌ Removed Supabase client and all dependencies
- ✅ Implemented Prisma ORM with PostgreSQL
- ✅ Created complete database schema with 6 models
- ✅ Built REST API routes for transactions, bills, and uploads
- ✅ Ready for Vercel deployment with Postgres

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Set DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@host:5432/slbudget"

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 3. Development
```bash
npm run dev
```

### 4. Deploy to Vercel
```bash
# Connect Vercel Postgres
vercel env add DATABASE_URL

# Deploy
vercel --prod
```

## 📊 Database Schema (Prisma)

- **User** - User profiles with language/currency preferences
- **Category** - Income/expense categories
- **Transaction** - All financial transactions
- **Bill** - Recurring bills with reminders
- **Budget** - Monthly/yearly budgets
- **SavingsGoal** - Savings targets

## 🏦 Supported Banks (15)

Commercial Bank, Sampath Bank, HNB, BOC, Seylan Bank, DFCC, NDB, Union Bank, Pan Asia Bank, NSB, People's Bank, Amana Bank, Cargills Bank, HSBC, Standard Chartered

## 🔑 Environment Variables

```env
DATABASE_URL="postgresql://..."
GEMINI_API_KEY="your_key"
ANTHROPIC_API_KEY="your_key"
```

## 📱 Features

- ✅ Expense tracking with categories
- ✅ Bank statement upload (CSV/PDF)
- ✅ Bill reminders
- ✅ Budget management
- ✅ AI-powered insights
- ✅ Multi-language (EN, SI, TA)
- ✅ PWA (offline support)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Styling:** Tailwind CSS
- **AI:** Google Gemini + Claude
- **Deployment:** Vercel

## 📝 API Routes

- `GET/POST/PUT/DELETE /api/transactions` - Transaction management
- `GET/POST/PUT/DELETE /api/bills` - Bill management
- `POST /api/upload` - Bank statement upload

## 🎯 Migration Notes

**What Changed:**
1. Replaced `@supabase/supabase-js` with `@prisma/client`
2. Removed Supabase auth helpers
3. Created Prisma schema with all tables
4. Updated all API routes to use Prisma
5. No auth system (add later if needed)

**Database Compatibility:**
- Supabase used PostgreSQL ✓
- Prisma uses PostgreSQL ✓
- Schema is compatible, just need to migrate data if exists

---

**Developed for Sri Lanka** 🇱🇰 | Powered by Prisma + Vercel
