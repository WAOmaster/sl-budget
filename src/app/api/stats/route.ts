// Stats API Route using Firebase Admin SDK
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// GET /api/stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';
    
    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }
    
    // Fetch transactions for the period
    const transactionsSnapshot = await adminDb
      .collection(COLLECTIONS.TRANSACTIONS)
      .where('createdAt', '>=', startDate)
      .get();
    
    const transactions = transactionsSnapshot.docs.map(doc => doc.data());
    
    // Calculate stats
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryBreakdown: Record<string, number> = {};
    
    transactions.forEach(txn => {
      const amount = txn.amount || 0;
      if (txn.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
        const category = txn.category || 'uncategorized';
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + amount;
      }
    });
    
    // Fetch upcoming bills
    const billsSnapshot = await adminDb
      .collection(COLLECTIONS.BILLS)
      .where('isPaid', '==', false)
      .limit(10)
      .get();
    
    const upcomingBills = billsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        period,
        totalIncome,
        totalExpenses,
        netSavings: totalIncome - totalExpenses,
        transactionCount: transactions.length,
        categoryBreakdown,
        upcomingBillsCount: upcomingBills.length,
        upcomingBills: upcomingBills.slice(0, 5),
      }
    });
  } catch (error) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats', details: String(error) },
      { status: 500 }
    );
  }
}
