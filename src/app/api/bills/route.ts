import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const bills = await prisma.bill.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json(bills);
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json({ error: 'Failed to fetch bills' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, amount, dueDate, frequency, categoryId, reminderEnabled, reminderDaysBefore, notes } = body;

    if (!userId || !name || !amount || !dueDate || !frequency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bill = await prisma.bill.create({
      data: {
        userId,
        name,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        frequency,
        categoryId,
        reminderEnabled: reminderEnabled ?? true,
        reminderDaysBefore: reminderDaysBefore ?? 3,
        notes,
      },
      include: { category: true },
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Bill ID required' }, { status: 400 });
    }

    const bill = await prisma.bill.update({
      where: { id },
      data: {
        ...data,
        amount: data.amount ? parseFloat(data.amount) : undefined,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
      include: { category: true },
    });

    return NextResponse.json(bill);
  } catch (error) {
    console.error('Error updating bill:', error);
    return NextResponse.json({ error: 'Failed to update bill' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Bill ID required' }, { status: 400 });
    }

    await prisma.bill.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bill:', error);
    return NextResponse.json({ error: 'Failed to delete bill' }, { status: 500 });
  }
}
