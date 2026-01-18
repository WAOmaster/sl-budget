// Bills API Route
// GET, POST, PUT, DELETE operations for bills

import { NextRequest, NextResponse } from 'next/server';
import {
  getBills,
  getBill,
  getUpcomingBills,
  getOverdueBills,
  addBill,
  updateBill,
  markBillAsPaid,
  deleteBill,
  getBillSummary,
  BILL_TEMPLATES,
} from '@/services/billService';
import type { BillInput } from '@/types';

// GET /api/bills
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Single bill by ID
    const id = searchParams.get('id');
    if (id) {
      const bill = await getBill(id);
      if (!bill) {
        return NextResponse.json(
          { success: false, error: 'Bill not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: bill });
    }
    
    // Filter options
    const filter = searchParams.get('filter');
    
    switch (filter) {
      case 'upcoming':
        const days = parseInt(searchParams.get('days') || '7', 10);
        const upcoming = await getUpcomingBills(days);
        return NextResponse.json({
          success: true,
          data: upcoming,
          count: upcoming.length,
        });
      
      case 'overdue':
        const overdue = await getOverdueBills();
        return NextResponse.json({
          success: true,
          data: overdue,
          count: overdue.length,
        });
      
      case 'summary':
        const summary = await getBillSummary();
        return NextResponse.json({ success: true, data: summary });
      
      case 'templates':
        return NextResponse.json({ success: true, data: BILL_TEMPLATES });
      
      default:
        const bills = await getBills();
        return NextResponse.json({
          success: true,
          data: bills,
          count: bills.length,
        });
    }
  } catch (error) {
    console.error('GET /api/bills error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bills' },
      { status: 500 }
    );
  }
}

// POST /api/bills
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.amount || !body.dueDate || !body.frequency) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, amount, dueDate, frequency' },
        { status: 400 }
      );
    }
    
    const input: BillInput = {
      name: body.name,
      nameSi: body.nameSi,
      nameTa: body.nameTa,
      amount: parseFloat(body.amount),
      dueDate: new Date(body.dueDate),
      frequency: body.frequency,
      categoryId: body.categoryId,
      category: body.category,
      merchant: body.merchant,
      accountNumber: body.accountNumber,
      reminderEnabled: body.reminderEnabled !== false,
      reminderDaysBefore: body.reminderDaysBefore || 3,
      notes: body.notes,
      autoPay: body.autoPay || false,
    };
    
    const id = await addBill(input);
    
    return NextResponse.json(
      { success: true, data: { id }, message: 'Bill created' },
      { status: 201 }
    );
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
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Bill ID required' },
        { status: 400 }
      );
    }
    
    // Handle mark as paid action
    if (body.action === 'markPaid') {
      await markBillAsPaid(
        body.id,
        body.paidAmount ? parseFloat(body.paidAmount) : undefined,
        body.paidDate ? new Date(body.paidDate) : new Date()
      );
      return NextResponse.json({ success: true, message: 'Bill marked as paid' });
    }
    
    // Regular update
    const { id, action, ...data } = body;
    
    // Convert dueDate if present
    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);
    }
    
    await updateBill(id, data);
    
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
    
    await deleteBill(id);
    
    return NextResponse.json({ success: true, message: 'Bill deleted' });
  } catch (error) {
    console.error('DELETE /api/bills error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete bill' },
      { status: 500 }
    );
  }
}
