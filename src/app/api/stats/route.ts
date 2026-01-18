import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || DEFAULT_USER_ID;
    const period = searchParams.get('period') || 'month';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Fetch transactions for the period
    const snapshot = await adminDb
      .collection(COLLECTIONS.TRANSACTIONS)
      .where('userId', '==', userId)
      .where('date', '>=', startDate.toISOString())
      .get();

    const transactions = snapshot.docs.map(doc => doc.data());

    // Calculate stats
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryBreakdown: Record<string, number> = {};

    transactions.forEach((t: any) => {
      const amount = Number(t.amount) || 0;
      if (t.type === 'income') {
        totalIncome += amount;
      } else {
        totalExpenses += amount;
        const category = t.category || 'Other';
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + amount;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        transactionCount: transactions.length,
        categoryBreakdown,
        period,
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
