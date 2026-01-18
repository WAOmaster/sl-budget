// Transactions API Route
// GET, POST, PUT, DELETE operations for transactions

import { NextRequest, NextResponse } from 'next/server';
import {
  getTransactions,
  getTransaction,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  markAsReviewed,
} from '@/services/transactionService';
import type { TransactionFilters, TransactionInput } from '@/types';

// GET /api/transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters: TransactionFilters = {};
    
    // Parse query params
    if (searchParams.get('type')) {
      filters.type = searchParams.get('type') as any;
    }
    if (searchParams.get('category')) {
      filters.category = searchParams.get('category')!;
    }
    if (searchParams.get('source')) {
      filters.source = searchParams.get('source') as any;
    }
    if (searchParams.get('startDate')) {
      filters.startDate = new Date(searchParams.get('startDate')!);
    }
    if (searchParams.get('endDate')) {
      filters.endDate = new Date(searchParams.get('endDate')!);
    }
    if (searchParams.get('needsReview')) {
      filters.needsReview = searchParams.get('needsReview') === 'true';
    }
    if (searchParams.get('limit')) {
      filters.limit = parseInt(searchParams.get('limit')!, 10);
    }
    
    // Single transaction by ID
    const id = searchParams.get('id');
    if (id) {
      const transaction = await getTransaction(id);
      if (!transaction) {
        return NextResponse.json(
          { success: false, error: 'Transaction not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: transaction });
    }
    
    // List transactions
    const transactions = await getTransactions(filters);
    return NextResponse.json({
      success: true,
      data: transactions,
      count: transactions.length,
    });
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.type || !body.amount || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, amount, category' },
        { status: 400 }
      );
    }
    
    const input: TransactionInput = {
      type: body.type,
      amount: parseFloat(body.amount),
      category: body.category,
      categoryId: body.categoryId,
      merchant: body.merchant,
      description: body.description,
      notes: body.notes,
      bank: body.bank,
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
      isRecurring: body.isRecurring || false,
      tags: body.tags || [],
    };
    
    const id = await addTransaction(input);
    
    return NextResponse.json(
      { success: true, data: { id }, message: 'Transaction created' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

// PUT /api/transactions
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID required' },
        { status: 400 }
      );
    }
    
    // Handle mark as reviewed action
    if (body.action === 'markReviewed') {
      await markAsReviewed(body.id, body.category);
      return NextResponse.json({ success: true, message: 'Transaction marked as reviewed' });
    }
    
    // Regular update
    const { id, action, ...data } = body;
    await updateTransaction(id, data);
    
    return NextResponse.json({ success: true, message: 'Transaction updated' });
  } catch (error) {
    console.error('PUT /api/transactions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID required' },
        { status: 400 }
      );
    }
    
    await deleteTransaction(id);
    
    return NextResponse.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    console.error('DELETE /api/transactions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
