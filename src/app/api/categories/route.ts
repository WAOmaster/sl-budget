import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍛', type: 'expense', color: '#FF6B6B' },
  { name: 'Transport', icon: '🚌', type: 'expense', color: '#4ECDC4' },
  { name: 'Shopping', icon: '🛒', type: 'expense', color: '#45B7D1' },
  { name: 'Bills & Utilities', icon: '💡', type: 'expense', color: '#96CEB4' },
  { name: 'Entertainment', icon: '🎬', type: 'expense', color: '#FFEAA7' },
  { name: 'Healthcare', icon: '🏥', type: 'expense', color: '#DDA0DD' },
  { name: 'Education', icon: '📚', type: 'expense', color: '#98D8C8' },
  { name: 'Groceries', icon: '🥬', type: 'expense', color: '#7FFF00' },
  { name: 'Fuel', icon: '⛽', type: 'expense', color: '#FFB347' },
  { name: 'Mobile & Internet', icon: '📱', type: 'expense', color: '#87CEEB' },
  { name: 'Insurance', icon: '🛡️', type: 'expense', color: '#9B59B6' },
  { name: 'Salary', icon: '💰', type: 'income', color: '#2ECC71' },
  { name: 'Freelance', icon: '💻', type: 'income', color: '#3498DB' },
  { name: 'Investments', icon: '📈', type: 'income', color: '#F1C40F' },
  { name: 'Other Income', icon: '💵', type: 'income', color: '#1ABC9C' },
  { name: 'Other', icon: '📦', type: 'expense', color: '#BDC3C7' },
];

export async function GET(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || DEFAULT_USER_ID;

    const snapshot = await adminDb
      .collection(COLLECTIONS.CATEGORIES)
      .where('userId', '==', userId)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ 
        success: true, 
        data: DEFAULT_CATEGORIES,
        count: DEFAULT_CATEGORIES.length,
        isDefault: true 
      });
    }

    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, data: categories, count: categories.length });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ 
      success: true, 
      data: DEFAULT_CATEGORIES,
      count: DEFAULT_CATEGORIES.length,
      isDefault: true 
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminDb = getAdminDb();
    const body = await request.json();
    const userId = body.userId || DEFAULT_USER_ID;
    
    const categoryData = {
      ...body,
      userId,
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection(COLLECTIONS.CATEGORIES).add(categoryData);

    return NextResponse.json({ 
      success: true, 
      data: { id: docRef.id, ...categoryData } 
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category', details: String(error) },
      { status: 500 }
    );
  }
}
