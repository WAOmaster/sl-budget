// Bills API Route using Firebase Admin SDK
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// GET /api/bills
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    
    let query = adminDb.collection(COLLECTIONS.BILLS);
    
    if (filter === 'upcoming') {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      query = query.where('dueDate', '>=', now).where('dueDate', '<=', nextWeek) as any;
    }
    
    const snapshot = await query.orderBy('dueDate', 'asc').limit(50).get();
    
    const bills = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({
      success: true,
      data: bills,
      count: bills.length,
    });
  } catch (error) {
    console.error('GET /api/bills error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bills', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/bills
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const docRef = await adminDb.collection(COLLECTIONS.BILLS).add({
      ...body,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      isPaid: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return NextResponse.json({
      success: true,
      id: docRef.id,
    });
  } catch (error) {
    console.error('POST /api/bills error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create bill' },
      { status: 500 }
    );
  }
}

// PUT /api/bills
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Bill ID required' },
        { status: 400 }
      );
    }
    
    await adminDb.collection(COLLECTIONS.BILLS).doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
    
    return NextResponse.json({ success: true, message: 'Bill updated' });
  } catch (error) {
    console.error('PUT /api/bills error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update bill' },
      { status: 500 }
    );
  }
}

// DELETE /api/bills
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Bill ID required' },
        { status: 400 }
      );
    }
    
    await adminDb.collection(COLLECTIONS.BILLS).doc(id).delete();
    
    return NextResponse.json({ success: true, message: 'Bill deleted' });
  } catch (error) {
    console.error('DELETE /api/bills error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete bill' },
      { status: 500 }
    );
  }
}
