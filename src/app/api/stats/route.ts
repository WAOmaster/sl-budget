import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || DEFAULT_USER_ID;
    
    // Simple query - just get all transactions for user
    const snapshot = await adminDb
      .collection(COLLECTIONS.TRANSACTIONS)
      .where('userId', '==', userId)
      .get();
    
    const transactions = snapshot.docs.map(doc => doc.data());
    
    // Calculate stats client-side
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let totalIncome = 0;
    let totalExpenses = 0;
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    
    transactions.forEach((t: any) => {
      const amount = parseFloat(t.amount) || 0;
      const txDate = t.date?.toDate?.() || new Date(t.date);
      const isThisMonth = txDate >= startOfMonth;
      
      if (t.type === 'income') {
        totalIncome += amount;
        if (isThisMonth) monthlyIncome += amount;
      } else {
        totalExpenses += amount;
        if (isThisMonth) monthlyExpenses += amount;
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        monthlyIncome,
        monthlyExpenses,
        monthlyBalance: monthlyIncome - monthlyExpenses,
        transactionCount: transactions.length
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats', details: error.message },
      { status: 500 }
    );
  }
}
