// Budgets API Route
// GET, POST, PUT, DELETE operations for budgets

import { NextRequest, NextResponse } from 'next/server';
import {
  getBudgets,
  getBudget,
  getActiveBudgetsWithSpending,
  addBudget,
  updateBudget,
  deleteBudget,
  getBudgetSummary,
  createDefaultBudgets,
} from '@/services/budgetService';
import { DEFAULT_USER_ID } from '@/lib/firebase';
import type { BudgetInput } from '@/types';

// GET /api/budgets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Single budget by ID
    const id = searchParams.get('id');
    if (id) {
      const budget = await getBudget(id);
      if (!budget) {
        return NextResponse.json(
          { success: false, error: 'Budget not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: budget });
    }
    
    // Filter options
    const filter = searchParams.get('filter');
    
    switch (filter) {
      case 'withSpending':
        const budgetsWithSpending = await getActiveBudgetsWithSpending();
        return NextResponse.json({
          success: true,
          data: budgetsWithSpending,
          count: budgetsWithSpending.length,
        });
      
      case 'summary':
        const summary = await getBudgetSummary();
        return NextResponse.json({ success: true, data: summary });
      
      default:
        const budgets = await getBudgets();
        return NextResponse.json({
          success: true,
          data: budgets,
          count: budgets.length,
        });
    }
  } catch (error) {
    console.error('GET /api/budgets error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

// POST /api/budgets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle initialize defaults action
    if (body.action === 'initializeDefaults') {
      await createDefaultBudgets(DEFAULT_USER_ID);
      return NextResponse.json({ success: true, message: 'Default budgets created' });
    }
    
    // Validate required fields
    if (!body.name || !body.amount || !body.period) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, amount, period' },
        { status: 400 }
      );
    }
    
    const input: BudgetInput = {
      name: body.name,
      categoryId: body.categoryId,
      category: body.category,
      amount: parseFloat(body.amount),
      period: body.period,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      alertThreshold: body.alertThreshold ? parseInt(body.alertThreshold, 10) : 80,
    };
    
    const id = await addBudget(input);
    
    return NextResponse.json(
      { success: true, data: { id }, message: 'Budget created' },
      { status: 201 }
    );
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
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Budget ID required' },
        { status: 400 }
      );
    }
    
    const { id, ...data } = body;
    
    // Convert startDate if present
    if (data.startDate) {
      data.startDate = new Date(data.startDate);
    }
    
    await updateBudget(id, data);
    
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
    
    await deleteBudget(id);
    
    return NextResponse.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    console.error('DELETE /api/budgets error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete budget' },
      { status: 500 }
    );
  }
}
