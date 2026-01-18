import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || DEFAULT_USER_ID;
    
    // Simple query - just filter by userId, sort client-side to avoid index
    const snapshot = await adminDb
      .collection(COLLECTIONS.TRANSACTIONS)
      .where('userId', '==', userId)
      .limit(100)
      .get();
    
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort by date client-side
    transactions.sort((a: any, b: any) => {
      const dateA = a.date?.toDate?.() || new Date(a.date);
      const dateB = b.date?.toDate?.() || new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const body = await request.json();
    const userId = body.userId || DEFAULT_USER_ID;
    
    const transaction = {
      ...body,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const docRef = await adminDb.collection(COLLECTIONS.TRANSACTIONS).add(transaction);
    
    return NextResponse.json({ 
      success: true, 
      data: { id: docRef.id, ...transaction } 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction', details: error.message },
      { status: 500 }
    );
  }
}
