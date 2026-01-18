import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let query = adminDb.collection(COLLECTIONS.BILLS);
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    
    const snapshot = await query.get();
    const bills = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate?.toDate?.() || null,
        createdAt: data.createdAt?.toDate?.() || null,
      };
    });
    
    // Sort by dueDate
    bills.sort((a: any, b: any) => {
      const dateA = new Date(a.dueDate || 0);
      const dateB = new Date(b.dueDate || 0);
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
    
    const bill = {
      ...body,
      userId: body.userId || DEFAULT_USER_ID,
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
