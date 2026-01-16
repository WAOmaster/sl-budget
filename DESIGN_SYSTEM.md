# SL Budget - Next Generation Design System

> **A User-Centric, Sri Lankan-Inspired Budget App**
> Moving beyond generic AI aesthetics to authentic, culturally-rooted design

---

## Part 1: AS-IS Analysis

### Current State Summary

| Aspect | Status | Details |
|--------|--------|---------|
| **Frontend Pages** | 5% | Only landing page exists |
| **Design System** | 0% | No defined colors, typography, or components |
| **Component Library** | 0% | No reusable components |
| **Navigation** | 0% | No header, sidebar, or routing |
| **Dark Mode** | 0% | Not implemented |
| **Mobile UX** | 0% | No responsive patterns |
| **Sri Lankan Identity** | 0% | Generic blue gradient only |

### Current UI Problems

1. **Generic Tech Startup Look**
   - Blue gradient background (overused in fintech)
   - No cultural connection to Sri Lanka
   - Could be any budget app from anywhere

2. **Missing Core Functionality**
   - No dashboard
   - No transaction views
   - No data visualization
   - No interactive elements

3. **No Design Language**
   - Random Tailwind utilities
   - No consistent spacing/sizing
   - No component patterns

4. **Unused Dependencies**
   - Zustand (state) - not implemented
   - Recharts (charts) - not integrated
   - Framer Motion (animations) - not used
   - Lucide React (icons) - not utilized

---

## Part 2: TO-BE Vision

### Design Philosophy: "Authentic Sri Lankan Simplicity"

**Core Principles:**

1. **Cultural Authenticity Over Generic AI**
   - No neon gradients, glowing orbs, or "futuristic" clichés
   - Inspired by Sri Lankan batik patterns, temple architecture, and natural landscapes
   - Warm, earthy tones mixed with vibrant festival colors

2. **Function-First Design**
   - Every element serves a purpose
   - Fast, scannable information hierarchy
   - Touch-friendly for mobile-first Sri Lankan users

3. **Local Context Awareness**
   - LKR currency formatting (Rs. 1,500.00)
   - Sri Lankan bank logos and familiar naming
   - Sinhala/Tamil language support built-in
   - Festival-aware (Vesak, Avurudu, Deepavali budgeting)

4. **Progressive Disclosure**
   - Simple by default, powerful when needed
   - No overwhelming dashboards
   - Contextual insights, not constant notifications

---

## Part 3: Color System - "Ceylon Palette"

### Philosophy
Inspired by Sri Lanka's natural beauty: golden beaches, emerald tea hills, terracotta temples, and lotus ponds.

### Primary Colors

```css
/* Cinnamon Gold - Primary */
--cinnamon-50: #fef7ed;
--cinnamon-100: #fcecd5;
--cinnamon-200: #f8d5aa;
--cinnamon-300: #f3b974;
--cinnamon-400: #ed953c;
--cinnamon-500: #e87a1b;  /* Primary Action */
--cinnamon-600: #d45f11;
--cinnamon-700: #b04511;
--cinnamon-800: #8d3716;
--cinnamon-900: #742f15;
```

### Secondary Colors

```css
/* Tea Green - Growth/Savings */
--tea-50: #f0fdf4;
--tea-100: #dcfce7;
--tea-200: #bbf7d0;
--tea-300: #86efac;
--tea-400: #4ade80;
--tea-500: #22c55e;  /* Savings, Income */
--tea-600: #16a34a;
--tea-700: #15803d;
--tea-800: #166534;
--tea-900: #14532d;

/* Ocean Blue - Trust/Stability */
--ocean-50: #eff6ff;
--ocean-100: #dbeafe;
--ocean-200: #bfdbfe;
--ocean-300: #93c5fd;
--ocean-400: #60a5fa;
--ocean-500: #3b82f6;  /* Links, Info */
--ocean-600: #2563eb;
--ocean-700: #1d4ed8;
--ocean-800: #1e40af;
--ocean-900: #1e3a8a;

/* Lotus Pink - Alerts/Important */
--lotus-50: #fdf2f8;
--lotus-100: #fce7f3;
--lotus-200: #fbcfe8;
--lotus-300: #f9a8d4;
--lotus-400: #f472b6;
--lotus-500: #ec4899;  /* Overbudget, Urgent */
--lotus-600: #db2777;
--lotus-700: #be185d;
--lotus-800: #9d174d;
--lotus-900: #831843;
```

### Neutral System

```css
/* Temple Stone - Neutrals */
--stone-50: #fafaf9;
--stone-100: #f5f5f4;
--stone-200: #e7e5e4;
--stone-300: #d6d3d1;
--stone-400: #a8a29e;
--stone-500: #78716c;
--stone-600: #57534e;
--stone-700: #44403c;
--stone-800: #292524;
--stone-900: #1c1917;
```

### Semantic Colors

```css
/* Functional */
--success: var(--tea-500);
--warning: var(--cinnamon-400);
--error: #dc2626;
--info: var(--ocean-500);

/* Backgrounds */
--bg-primary: #fefdfb;  /* Warm white */
--bg-secondary: var(--stone-50);
--bg-dark: var(--stone-900);
--bg-dark-secondary: var(--stone-800);
```

---

## Part 4: Typography System

### Font Stack

```css
/* Primary: Clean, readable, supports Sinhala/Tamil */
--font-sans: 'Inter', 'Noto Sans Sinhala', 'Noto Sans Tamil', system-ui, sans-serif;

/* Monospace: For numbers/currency */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| `display` | 3rem (48px) | 700 | Hero headlines |
| `h1` | 2.25rem (36px) | 700 | Page titles |
| `h2` | 1.875rem (30px) | 600 | Section headers |
| `h3` | 1.5rem (24px) | 600 | Card titles |
| `h4` | 1.25rem (20px) | 600 | Subsections |
| `body-lg` | 1.125rem (18px) | 400 | Important text |
| `body` | 1rem (16px) | 400 | Default text |
| `body-sm` | 0.875rem (14px) | 400 | Secondary text |
| `caption` | 0.75rem (12px) | 500 | Labels, hints |
| `currency` | varies | 600 | Money amounts (mono) |

### Currency Display

```tsx
// Large amounts (dashboard totals)
<span className="font-mono text-3xl font-semibold">
  Rs. 125,430.00
</span>

// Transaction amounts
<span className="font-mono text-lg font-medium text-tea-600">
  + Rs. 5,000.00
</span>
<span className="font-mono text-lg font-medium text-lotus-600">
  - Rs. 1,250.00
</span>
```

---

## Part 5: Component Library

### 1. Buttons

```
┌─────────────────────────────────────────────────────────────────┐
│  PRIMARY          SECONDARY        GHOST           DANGER       │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ Add Bill │    │  Cancel  │    │  Details │    │  Delete  │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│  cinnamon-500    stone-200       transparent     red-500       │
│  white text      stone-700       cinnamon-600    white         │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Cards

**Transaction Card**
```
┌────────────────────────────────────────────────────────┐
│  ┌────┐                                                │
│  │ 🛒 │  Keells Super            Today, 2:30 PM       │
│  └────┘  Groceries                                     │
│                                                        │
│          Commercial Bank •••4521    - Rs. 3,450.00    │
└────────────────────────────────────────────────────────┘
```

**Budget Progress Card**
```
┌────────────────────────────────────────────────────────┐
│  Food & Dining                         Rs. 12,500/20K │
│  ████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░   62.5%   │
│                                                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                  │
│  │ 15 days │ │ Rs.7.5K │ │ On Track│                  │
│  │   left  │ │remaining│ │    ✓    │                  │
│  └─────────┘ └─────────┘ └─────────┘                  │
└────────────────────────────────────────────────────────┘
```

**Savings Goal Card**
```
┌────────────────────────────────────────────────────────┐
│  🏖️  Arugam Bay Trip                                  │
│                                                        │
│     Rs. 45,000 / Rs. 75,000                           │
│     ██████████████████████░░░░░░░░░░░░░░  60%         │
│                                                        │
│     30,000 more to go  •  Target: April 2026          │
│                                        ┌────────────┐ │
│                                        │ + Add Funds│ │
│                                        └────────────┘ │
└────────────────────────────────────────────────────────┘
```

### 3. Navigation

**Mobile Bottom Navigation**
```
┌────────────────────────────────────────────────────────┐
│   🏠        📊        ➕        📋        👤          │
│  Home    Budget     Add     History   Profile         │
│   ●                                                    │
└────────────────────────────────────────────────────────┘
```

**Desktop Sidebar**
```
┌──────────────────┐
│  SL Budget       │
│  ────────────    │
│                  │
│  ◉ Overview      │
│  ○ Transactions  │
│  ○ Budgets       │
│  ○ Bills         │
│  ○ Savings       │
│  ○ Analytics     │
│  ────────────    │
│  ○ Import        │
│  ○ Settings      │
└──────────────────┘
```

### 4. Form Inputs

**Text Input**
```
┌────────────────────────────────────────────────────────┐
│  Description                                           │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Enter transaction description...                 │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

**Amount Input (Special)**
```
┌────────────────────────────────────────────────────────┐
│  Amount                                                │
│  ┌────────┬─────────────────────────────────────────┐ │
│  │  Rs.   │  0.00                                   │ │
│  └────────┴─────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

**Bank Selector**
```
┌────────────────────────────────────────────────────────┐
│  Select Bank                                           │
│  ┌──────────────────────────────────────────────────┐ │
│  │  🏦 Commercial Bank                          ▼   │ │
│  └──────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────┐ │
│  │  🏦 Commercial Bank                    ✓         │ │
│  │  🏦 Sampath Bank                                 │ │
│  │  🏦 Hatton National Bank                         │ │
│  │  🏦 Bank of Ceylon                               │ │
│  │  🏦 People's Bank                                │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## Part 6: Page Designs

### Dashboard (Home)

**Desktop Layout**
```
┌─────────────────────────────────────────────────────────────────────────┐
│  ┌────────────────┐ ┌──────────────────────────────────────────────────┤
│  │                │ │  Good morning, Sashi 🌅                          │
│  │   SL Budget    │ │                                                   │
│  │                │ │  ┌──────────────────────────────────────────────┐│
│  │  ◉ Overview    │ │  │  YOUR BALANCE                                ││
│  │  ○ Transactions│ │  │                                              ││
│  │  ○ Budgets     │ │  │  Rs. 125,430.00                              ││
│  │  ○ Bills       │ │  │  ████████░░░ 65% of monthly budget remaining ││
│  │  ○ Savings     │ │  └──────────────────────────────────────────────┘│
│  │  ○ Analytics   │ │                                                   │
│  │                │ │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │  ─────────     │ │  │ INCOME      │ │ EXPENSES    │ │ SAVINGS     │ │
│  │  ○ Import      │ │  │ Rs. 85,000  │ │ Rs. 42,300  │ │ Rs. 15,000  │ │
│  │  ○ Settings    │ │  │ ↑ 12%       │ │ ↓ 8%        │ │ ↑ 5%        │ │
│  │                │ │  └─────────────┘ └─────────────┘ └─────────────┘ │
│  │                │ │                                                   │
│  │                │ │  RECENT TRANSACTIONS                             │
│  │                │ │  ┌──────────────────────────────────────────────┐│
│  │                │ │  │ 🛒 Keells    Groceries    - Rs. 3,450   Today││
│  │                │ │  │ ⛽ Lanka IOC  Transport   - Rs. 2,100   Today││
│  │                │ │  │ 💰 Salary    Income      + Rs.85,000   Jan 1 ││
│  │                │ │  └──────────────────────────────────────────────┘│
│  │                │ │                                                   │
│  │                │ │  UPCOMING BILLS              BUDGET STATUS        │
│  │                │ │  ┌────────────────────┐     ┌────────────────────┐│
│  │                │ │  │ Electricity  Jan 15│     │ Food       ████░ 80%│
│  │                │ │  │ Rs. 4,500    3 days│     │ Transport  ██░░░ 40%│
│  │                │ │  │                    │     │ Shopping   █████ 95%│
│  │                │ │  │ Dialog Bill  Jan 20│     │                    ││
│  │                │ │  │ Rs. 2,800    8 days│     │                    ││
│  │                │ │  └────────────────────┘     └────────────────────┘│
│  └────────────────┘ └──────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────────────┘
```

**Mobile Layout**
```
┌─────────────────────────┐
│  SL Budget    👤  🔔    │
├─────────────────────────┤
│                         │
│  Good morning, Sashi    │
│                         │
│  ┌───────────────────┐  │
│  │  YOUR BALANCE     │  │
│  │                   │  │
│  │  Rs. 125,430.00   │  │
│  │  ████████░░░ 65%  │  │
│  └───────────────────┘  │
│                         │
│  ┌───────┐ ┌───────┐    │
│  │INCOME │ │EXPENSE│    │
│  │Rs.85K │ │Rs.42K │    │
│  └───────┘ └───────┘    │
│                         │
│  RECENT                 │
│  ┌───────────────────┐  │
│  │🛒 Keells  -Rs.3.4K│  │
│  │⛽ IOC     -Rs.2.1K│  │
│  │💰 Salary +Rs.85K │  │
│  └───────────────────┘  │
│                         │
│  UPCOMING BILLS         │
│  ┌───────────────────┐  │
│  │⚡ Electricity     │  │
│  │   Rs. 4,500  3d   │  │
│  └───────────────────┘  │
│                         │
├─────────────────────────┤
│ 🏠  📊  ➕  📋  👤     │
└─────────────────────────┘
```

### Add Transaction (Quick Entry)

**Mobile-First Modal**
```
┌─────────────────────────┐
│     Add Transaction  ✕  │
├─────────────────────────┤
│                         │
│  ┌────────┐ ┌────────┐  │
│  │EXPENSE │ │ INCOME │  │
│  │   ●    │ │   ○    │  │
│  └────────┘ └────────┘  │
│                         │
│  Amount                 │
│  ┌───────────────────┐  │
│  │ Rs. │   0.00      │  │
│  └───────────────────┘  │
│                         │
│  Category               │
│  ┌───────────────────┐  │
│  │ 🍔 Food & Dining ▼│  │
│  └───────────────────┘  │
│                         │
│  Description            │
│  ┌───────────────────┐  │
│  │ What's this for?  │  │
│  └───────────────────┘  │
│                         │
│  Date          Bank     │
│  ┌────────┐  ┌────────┐ │
│  │ Today ▼│  │ Cash  ▼│ │
│  └────────┘  └────────┘ │
│                         │
│  ┌───────────────────┐  │
│  │    Save Entry     │  │
│  └───────────────────┘  │
│                         │
└─────────────────────────┘
```

### Bills Management

```
┌─────────────────────────────────────────────────────────────────┐
│  Bills & Payments                          + Add Bill           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  OVERDUE (1)                                                    │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🔴  Water Bill - NWSDB                                      ││
│  │     Rs. 1,200   Due: Jan 10 (5 days overdue)   [Pay Now]    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  DUE THIS WEEK (2)                                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🟡  Electricity - CEB                                       ││
│  │     Rs. 4,500   Due: Jan 15 (3 days)           [Pay Now]    ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ 🟡  Internet - SLT Fiber                                    ││
│  │     Rs. 2,999   Due: Jan 18 (6 days)           [Pay Now]    ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  UPCOMING                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🟢  Dialog Mobile                                           ││
│  │     Rs. 2,800   Due: Jan 20 (8 days)           [Mark Paid]  ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ 🟢  Rent                                                    ││
│  │     Rs. 35,000  Due: Feb 1 (20 days)           [Mark Paid]  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  This Month: Rs. 46,499 in bills                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 7: Unique Features for Sri Lankan Context

### 1. Festival Budget Planner
```
┌─────────────────────────────────────────────────────────────────┐
│  🎊 Sinhala & Tamil New Year Budget                            │
│     April 2026                                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────┐                   │
│  │  Total Festival Budget: Rs. 50,000       │                   │
│  └──────────────────────────────────────────┘                   │
│                                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │
│  │ Kiribath & │ │ New Clothes│ │ Oil Lamp & │ │ Gifts      │   │
│  │ Sweets     │ │            │ │ Decorations│ │            │   │
│  │ Rs.8,000   │ │ Rs.15,000  │ │ Rs.5,000   │ │ Rs.12,000  │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │
│                                                                 │
│  💡 Tip: Start saving Rs. 5,000/month from January!            │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Local Bank Statement Import

```
┌─────────────────────────────────────────────────────────────────┐
│  Import Bank Statement                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Select Your Bank                                               │
│                                                                 │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐         │
│  │ 🏦            │ │ 🏦            │ │ 🏦            │         │
│  │ Commercial    │ │ Sampath       │ │ HNB           │         │
│  │ Bank          │ │ Bank          │ │               │         │
│  └───────────────┘ └───────────────┘ └───────────────┘         │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐         │
│  │ 🏦            │ │ 🏦            │ │ 🏦            │         │
│  │ Bank of       │ │ People's      │ │ Seylan        │         │
│  │ Ceylon        │ │ Bank          │ │ Bank          │         │
│  └───────────────┘ └───────────────┘ └───────────────┘         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                                                             ││
│  │     📄 Drop your CSV or PDF statement here                  ││
│  │        or click to browse                                   ││
│  │                                                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ✓ We support all 15 major Sri Lankan banks                    │
│  ✓ Your data stays on your device                              │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Smart Insights (Not "AI Insights")

**Replace generic AI messaging with practical tips:**

```
┌─────────────────────────────────────────────────────────────────┐
│  💡 Smart Tips                                    This Month    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  📊 Food spending is 15% higher than last month             ││
│  │     You spent Rs. 4,200 more at restaurants.                ││
│  │     Consider meal prepping to save ~Rs. 3,000/month         ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  ⛽ Fuel costs are rising                                   ││
│  │     Rs. 8,500 this month vs Rs. 6,200 last month            ││
│  │     Check if carpooling or bus could save money             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  🎉 Great job on utilities!                                 ││
│  │     You're Rs. 800 under budget for electricity             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4. LKR-Specific Quick Actions

```
┌─────────────────────────────────────────────────────────────────┐
│  Quick Add                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Common Amounts (tap to add expense)                            │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Rs. 100 │ │ Rs. 500 │ │ Rs.1000 │ │ Rs.2000 │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                 │
│  Recent Categories                                              │
│                                                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ 🛒 Food │ │ ⛽ Fuel │ │ 🚌 Bus  │ │ 📱Phone │               │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 8: Animation & Interaction

### Micro-interactions (Framer Motion)

1. **Card Entry**: Fade up with slight scale (0.95 → 1)
2. **Button Press**: Slight scale down (0.98) with haptic feedback
3. **Tab Switch**: Smooth horizontal slide
4. **Modal Open**: Fade + slide up from bottom
5. **Success State**: Checkmark with confetti burst (subtle)
6. **Progress Bar**: Smooth width transition with slight overshoot

### Loading States

```
┌────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────┐  │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  │
│  │ ░░░░░░░░░░░░░░░░░░░░░                          │  │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░            │  │
│  └─────────────────────────────────────────────────┘  │
│  Skeleton loading with subtle shimmer animation       │
└────────────────────────────────────────────────────────┘
```

---

## Part 9: Accessibility & Language

### Multi-language Support

```
Settings → Language
┌─────────────────────────────────────────────────────────────────┐
│  Language / භාෂාව / மொழி                                        │
├─────────────────────────────────────────────────────────────────┤
│  ○ English                                                      │
│  ○ සිංහල (Sinhala)                                               │
│  ○ தமிழ் (Tamil)                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Translations

| English | Sinhala | Tamil |
|---------|---------|-------|
| Dashboard | මුල් පිටුව | முகப்பு |
| Income | ආදායම | வருமானம் |
| Expense | වියදම | செலவு |
| Budget | අයවැය | பட்ஜெட் |
| Savings | ඉතිරි කිරීම් | சேமிப்பு |
| Bills | බිල්පත් | பில்கள் |

---

## Part 10: Implementation Priority

### Phase 1: Foundation (Week 1)
1. ✅ Design system tokens (colors, typography, spacing)
2. ✅ Base components (Button, Card, Input, Badge)
3. ✅ Layout components (Sidebar, Header, BottomNav)
4. ✅ App shell with routing

### Phase 2: Core Pages (Week 2)
1. Dashboard/Overview page
2. Transaction list page
3. Add transaction modal
4. Bills page

### Phase 3: Advanced Features (Week 3)
1. Budget management page
2. Savings goals page
3. Analytics/Charts page
4. Import page

### Phase 4: Polish (Week 4)
1. Dark mode
2. Animations
3. Multi-language
4. PWA optimization

---

## Part 11: File Structure (To Be)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx           # Main app layout with sidebar
│   │   ├── page.tsx             # Dashboard
│   │   ├── transactions/
│   │   │   ├── page.tsx         # Transaction list
│   │   │   └── [id]/page.tsx    # Transaction detail
│   │   ├── budgets/page.tsx
│   │   ├── bills/page.tsx
│   │   ├── savings/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── import/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   └── globals.css
├── components/
│   ├── ui/                      # Base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── modal.tsx
│   │   ├── select.tsx
│   │   └── progress.tsx
│   ├── layout/                  # Layout components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── bottom-nav.tsx
│   │   └── page-header.tsx
│   ├── transactions/            # Feature components
│   │   ├── transaction-card.tsx
│   │   ├── transaction-list.tsx
│   │   └── add-transaction-modal.tsx
│   ├── budgets/
│   │   ├── budget-card.tsx
│   │   └── budget-progress.tsx
│   ├── bills/
│   │   ├── bill-card.tsx
│   │   └── bill-list.tsx
│   ├── charts/
│   │   ├── spending-chart.tsx
│   │   └── category-pie.tsx
│   └── common/
│       ├── currency-display.tsx
│       ├── date-display.tsx
│       └── empty-state.tsx
├── lib/
│   ├── prisma.ts
│   ├── utils.ts
│   └── formatters.ts
├── stores/
│   └── app-store.ts             # Zustand store
├── hooks/
│   ├── use-transactions.ts
│   ├── use-budgets.ts
│   └── use-bills.ts
└── types/
    └── index.ts
```

---

**This design system prioritizes:**
- Sri Lankan cultural authenticity over generic fintech aesthetics
- Function and usability over flashy animations
- Mobile-first for the Sri Lankan market
- Practical insights over "AI-powered" marketing
- Warm, approachable colors over cold tech blues

