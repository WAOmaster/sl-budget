import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const collectionRef = adminDb.collection(COLLECTIONS.BUDGETS);
    const snapshot = userId 
      ? await collectionRef.where('userId', '==', userId).get()
      : await collectionRef.get();
    
    const budgets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({ success: true, data: budgets });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budgets', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const body = await request.json();
    
    const budget = {
      ...body,
      userId: body.userId || DEFAULT_USER_ID,
      spent: body.spent || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const docRef = await adminDb.collection(COLLECTIONS.BUDGETS).add(budget);
    return NextResponse.json({ success: true, data: { id: docRef.id, ...budget } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to create budget', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Budget ID required' }, { status: 400 });
    }
    
    await adminDb.collection(COLLECTIONS.BUDGETS).doc(id).update({
      ...updates,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, data: { id, ...updates } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to update budget', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Budget ID required' }, { status: 400 });
    }
    
    await adminDb.collection(COLLECTIONS.BUDGETS).doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete budget', details: error.message },
      { status: 500 }
    );
  }
}
