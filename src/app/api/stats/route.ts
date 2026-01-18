import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, COLLECTIONS } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let query = adminDb.collection(COLLECTIONS.TRANSACTIONS);
    
    // Only filter by userId if explicitly provided
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    
    const snapshot = await query.get();
    const transactions = snapshot.docs.map(doc => doc.data());
    
    // Calculate stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    
    let totalIncome = 0;
    let totalExpenses = 0;
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    let weeklyExpenses = 0;
    
    transactions.forEach((t: any) => {
      const amount = parseFloat(t.amount) || 0;
      const txDate = t.date?.toDate?.() || t.timestamp?.toDate?.() || t.createdAt?.toDate?.() || new Date(0);
      const isThisMonth = txDate >= startOfMonth;
      const isThisWeek = txDate >= startOfWeek;
      
      if (t.type === 'income') {
        totalIncome += amount;
        if (isThisMonth) monthlyIncome += amount;
      } else {
        totalExpenses += amount;
        if (isThisMonth) monthlyExpenses += amount;
        if (isThisWeek) weeklyExpenses += amount;
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
        weeklyExpenses,
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
