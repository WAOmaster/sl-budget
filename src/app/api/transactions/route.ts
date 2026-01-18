// Transactions API Route using Firebase Admin SDK
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// GET /api/transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    const snapshot = await adminDb
      .collection(COLLECTIONS.TRANSACTIONS)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({
      success: true,
      data: transactions,
      count: transactions.length,
    });
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/transactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const docRef = await adminDb.collection(COLLECTIONS.TRANSACTIONS).add({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return NextResponse.json({
      success: true,
      id: docRef.id,
    });
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
