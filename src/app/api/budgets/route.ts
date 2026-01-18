// Budgets API Route using Firebase Admin SDK
import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// GET /api/budgets
export async function GET(request: NextRequest) {
  try {
    const snapshot = await adminDb
      .collection(COLLECTIONS.BUDGETS)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    
    const budgets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json({
      success: true,
      data: budgets,
      count: budgets.length,
    });
  } catch (error) {
    console.error('GET /api/budgets error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budgets', details: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/budgets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const docRef = await adminDb.collection(COLLECTIONS.BUDGETS).add({
      ...body,
      spent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return NextResponse.json({
      success: true,
      id: docRef.id,
    });
  } catch (error) {
    console.error('POST /api/budgets error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}

// PUT /api/budgets
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Budget ID required' },
        { status: 400 }
      );
    }
    
    await adminDb.collection(COLLECTIONS.BUDGETS).doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
    
    return NextResponse.json({ success: true, message: 'Budget updated' });
  } catch (error) {
    console.error('PUT /api/budgets error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update budget' },
      { status: 500 }
    );
  }
}

// DELETE /api/budgets
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Budget ID required' },
        { status: 400 }
      );
    }
    
    await adminDb.collection(COLLECTIONS.BUDGETS).doc(id).delete();
    
    return NextResponse.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    console.error('DELETE /api/budgets error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}
