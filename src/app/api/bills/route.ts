import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || DEFAULT_USER_ID;
    
    const snapshot = await adminDb
      .collection(COLLECTIONS.BILLS)
      .where('userId', '==', userId)
      .get();
    
    const bills = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Sort by dueDate
    bills.sort((a: any, b: any) => {
      const dateA = a.dueDate?.toDate?.() || new Date(a.dueDate);
      const dateB = b.dueDate?.toDate?.() || new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });
    
    return NextResponse.json({ success: true, data: bills });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bills', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const body = await request.json();
    const userId = body.userId || DEFAULT_USER_ID;
    
    const bill = {
      ...body,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const docRef = await adminDb.collection(COLLECTIONS.BILLS).add(bill);
    return NextResponse.json({ success: true, data: { id: docRef.id, ...bill } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to create bill', details: error.message },
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
      return NextResponse.json({ success: false, error: 'Bill ID required' }, { status: 400 });
    }
    
    await adminDb.collection(COLLECTIONS.BILLS).doc(id).update({
      ...updates,
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, data: { id, ...updates } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to update bill', details: error.message },
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
      return NextResponse.json({ success: false, error: 'Bill ID required' }, { status: 400 });
    }
    
    await adminDb.collection(COLLECTIONS.BILLS).doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete bill', details: error.message },
      { status: 500 }
    );
  }
}
