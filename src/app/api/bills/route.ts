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
      .orderBy('dueDate', 'asc')
      .get();

    const bills = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, data: bills, count: bills.length });
  } catch (error) {
    console.error('GET /api/bills error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bills', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const body = await request.json();
    const userId = body.userId || DEFAULT_USER_ID;
    
    const billData = {
      ...body,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection(COLLECTIONS.BILLS).add(billData);

    return NextResponse.json({ 
      success: true, 
      data: { id: docRef.id, ...billData } 
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/bills error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create bill', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Bill ID is required' },
        { status: 400 }
      );
    }

    await adminDb.collection(COLLECTIONS.BILLS).doc(id).update({
      ...updateData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: { id, ...updateData } });
  } catch (error) {
    console.error('PUT /api/bills error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update bill', details: String(error) },
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
      return NextResponse.json(
        { success: false, error: 'Bill ID is required' },
        { status: 400 }
      );
    }

    await adminDb.collection(COLLECTIONS.BILLS).doc(id).delete();

    return NextResponse.json({ success: true, message: 'Bill deleted' });
  } catch (error) {
    console.error('DELETE /api/bills error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete bill', details: String(error) },
      { status: 500 }
    );
  }
}
