// Categories API Route
// GET, POST, PUT, DELETE operations for categories

import { NextRequest, NextResponse } from 'next/server';
import {
  getCategories,
  getCategoriesByType,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  DEFAULT_CATEGORIES,
} from '@/services/categoryService';
import type { CategoryInput } from '@/types';

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Single category by ID
    const id = searchParams.get('id');
    if (id) {
      const category = await getCategory(id);
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: category });
    }
    
    // Filter by type
    const type = searchParams.get('type') as 'income' | 'expense' | 'both' | null;
    
    const categories = type 
      ? await getCategoriesByType(type)
      : await getCategories();
    
    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.icon || !body.color || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, icon, color, type' },
        { status: 400 }
      );
    }
    
    const input: CategoryInput = {
      name: body.name,
      nameSi: body.nameSi,
      nameTa: body.nameTa,
      icon: body.icon,
      color: body.color,
      type: body.type,
      parentId: body.parentId,
      budget: body.budget ? parseFloat(body.budget) : undefined,
    };
    
    const id = await addCategory(input);
    
    return NextResponse.json(
      { success: true, data: { id }, message: 'Category created' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Category ID required' },
        { status: 400 }
      );
    }
    
    const { id, ...data } = body;
    await updateCategory(id, data);
    
    return NextResponse.json({ success: true, message: 'Category updated' });
  } catch (error) {
    console.error('PUT /api/categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID required' },
        { status: 400 }
      );
    }
    
    await deleteCategory(id);
    
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('DELETE /api/categories error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
