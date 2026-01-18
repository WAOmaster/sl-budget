import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    let query = adminDb.collection(COLLECTIONS.TRANSACTIONS).limit(limit);
    
    // Only filter by userId if explicitly provided
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    
    const snapshot = await query.get();
    
    const transactions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Normalize date fields
        date: data.date?.toDate?.() || data.timestamp?.toDate?.() || data.createdAt?.toDate?.() || null,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
      };
    });
    
    // Sort by date descending
    transactions.sort((a: any, b: any) => {
      const dateA = new Date(a.date || a.createdAt || 0);
      const dateB = new Date(b.date || b.createdAt || 0);
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
    
    const transaction = {
      ...body,
      userId: body.userId || DEFAULT_USER_ID,
      source: body.source || 'manual',
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
