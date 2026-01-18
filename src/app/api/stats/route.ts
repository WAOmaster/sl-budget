// Stats API Route
// GET transaction statistics and dashboard data

import { NextRequest, NextResponse } from 'next/server';
import { getTransactionStats, getRecentTransactions, getTransactionsNeedingReview } from '@/services/transactionService';
import { getUpcomingBills, getBillSummary } from '@/services/billService';
import { getBudgetSummary, getActiveBudgetsWithSpending } from '@/services/budgetService';

// GET /api/stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    
    // Parse date range
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    
    const period = searchParams.get('period');
    const now = new Date();
    
    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date();
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31);
        break;
      default:
        if (searchParams.get('startDate')) {
          startDate = new Date(searchParams.get('startDate')!);
        }
        if (searchParams.get('endDate')) {
          endDate = new Date(searchParams.get('endDate')!);
        }
    }
    
    // Return different stats based on type
    switch (type) {
      case 'transactions':
        const transactionStats = await getTransactionStats(startDate, endDate);
        return NextResponse.json({ success: true, data: transactionStats });
      
      case 'bills':
        const billSummary = await getBillSummary();
        return NextResponse.json({ success: true, data: billSummary });
      
      case 'budgets':
        const budgetSummary = await getBudgetSummary();
        return NextResponse.json({ success: true, data: budgetSummary });
      
      case 'dashboard':
      case 'all':
      default:
        // Comprehensive dashboard data
        const [
          stats,
          recentTransactions,
          upcomingBills,
          budgets,
          pendingReview,
          billStats,
        ] = await Promise.all([
          getTransactionStats(startDate, endDate),
          getRecentTransactions(10),
          getUpcomingBills(7),
          getActiveBudgetsWithSpending(),
          getTransactionsNeedingReview(5),
          getBillSummary(),
        ]);
        
        return NextResponse.json({
          success: true,
          data: {
            stats,
            recentTransactions,
            upcomingBills,
            budgets,
            pendingReview,
            billStats,
            period: period || 'all-time',
          },
        });
    }
  } catch (error) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
