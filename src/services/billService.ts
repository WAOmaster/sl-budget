// Bill Service - Manage recurring bills and reminders
// Sri Lankan context: CEB, NWSDB, Dialog, Mobitel, etc.

import {
  collection,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { firestore, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase';
import type { Bill, BillInput } from '@/types';

// Convert Firestore document to Bill
function docToBill(doc: any): Bill {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    name: data.name,
    nameSi: data.nameSi,
    nameTa: data.nameTa,
    amount: Number(data.amount) || 0,
    currency: data.currency || 'LKR',
    dueDate: data.dueDate?.toDate() || new Date(),
    frequency: data.frequency || 'monthly',
    categoryId: data.categoryId,
    category: data.category,
    merchant: data.merchant,
    accountNumber: data.accountNumber,
    isPaid: data.isPaid || false,
    paidDate: data.paidDate?.toDate(),
    paidAmount: data.paidAmount,
    reminderEnabled: data.reminderEnabled !== false,
    reminderDaysBefore: data.reminderDaysBefore || 3,
    notes: data.notes,
    autoPay: data.autoPay || false,
    lastPaidDate: data.lastPaidDate?.toDate(),
    nextDueDate: data.nextDueDate?.toDate(),
    isActive: data.isActive !== false,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
}

// Get all bills for a user
export async function getBills(
  userId: string = DEFAULT_USER_ID,
  includeInactive = false
): Promise<Bill[]> {
  const constraints = [
    where('userId', '==', userId),
    orderBy('dueDate', 'asc'),
  ];
  
  if (!includeInactive) {
    constraints.splice(1, 0, where('isActive', '==', true));
  }
  
  const q = query(collection(firestore, COLLECTIONS.BILLS), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToBill);
}

// Get upcoming bills (due within X days)
export async function getUpcomingBills(
  days: number = 7,
  userId: string = DEFAULT_USER_ID
): Promise<Bill[]> {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  const q = query(
    collection(firestore, COLLECTIONS.BILLS),
    where('userId', '==', userId),
    where('isActive', '==', true),
    where('isPaid', '==', false),
    where('dueDate', '<=', Timestamp.fromDate(futureDate)),
    orderBy('dueDate', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToBill);
}

// Get overdue bills
export async function getOverdueBills(userId: string = DEFAULT_USER_ID): Promise<Bill[]> {
  const now = new Date();
  
  const q = query(
    collection(firestore, COLLECTIONS.BILLS),
    where('userId', '==', userId),
    where('isActive', '==', true),
    where('isPaid', '==', false),
    where('dueDate', '<', Timestamp.fromDate(now)),
    orderBy('dueDate', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(docToBill);
}

// Get single bill
export async function getBill(id: string): Promise<Bill | null> {
  const docRef = doc(firestore, COLLECTIONS.BILLS, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docToBill(docSnap) : null;
}

// Add new bill
export async function addBill(
  input: BillInput,
  userId: string = DEFAULT_USER_ID
): Promise<string> {
  const nextDueDate = calculateNextDueDate(input.dueDate, input.frequency);
  
  const docRef = await addDoc(collection(firestore, COLLECTIONS.BILLS), {
    ...input,
    userId,
    currency: 'LKR',
    dueDate: Timestamp.fromDate(input.dueDate),
    nextDueDate: Timestamp.fromDate(nextDueDate),
    isPaid: false,
    isActive: true,
    reminderEnabled: input.reminderEnabled !== false,
    reminderDaysBefore: input.reminderDaysBefore || 3,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update bill
export async function updateBill(id: string, data: Partial<BillInput>): Promise<void> {
  const updates: Record<string, unknown> = { ...data, updatedAt: serverTimestamp() };
  
  if (data.dueDate) {
    updates.dueDate = Timestamp.fromDate(data.dueDate);
    if (data.frequency) {
      updates.nextDueDate = Timestamp.fromDate(calculateNextDueDate(data.dueDate, data.frequency));
    }
  }
  
  await updateDoc(doc(firestore, COLLECTIONS.BILLS, id), updates);
}

// Mark bill as paid
export async function markBillAsPaid(
  id: string,
  paidAmount?: number,
  paidDate: Date = new Date()
): Promise<void> {
  const bill = await getBill(id);
  if (!bill) throw new Error('Bill not found');
  
  const nextDueDate = calculateNextDueDate(bill.dueDate, bill.frequency);
  
  await updateDoc(doc(firestore, COLLECTIONS.BILLS, id), {
    isPaid: bill.frequency === 'one_time',
    paidDate: Timestamp.fromDate(paidDate),
    paidAmount: paidAmount || bill.amount,
    lastPaidDate: Timestamp.fromDate(paidDate),
    dueDate: Timestamp.fromDate(nextDueDate),
    nextDueDate: Timestamp.fromDate(calculateNextDueDate(nextDueDate, bill.frequency)),
    updatedAt: serverTimestamp(),
  });
}

// Mark bill as unpaid (reset for recurring)
export async function markBillAsUnpaid(id: string): Promise<void> {
  await updateDoc(doc(firestore, COLLECTIONS.BILLS, id), {
    isPaid: false,
    paidDate: null,
    paidAmount: null,
    updatedAt: serverTimestamp(),
  });
}

// Delete bill (soft delete)
export async function deleteBill(id: string): Promise<void> {
  await updateDoc(doc(firestore, COLLECTIONS.BILLS, id), {
    isActive: false,
    updatedAt: serverTimestamp(),
  });
}

// Hard delete bill
export async function permanentlyDeleteBill(id: string): Promise<void> {
  await deleteDoc(doc(firestore, COLLECTIONS.BILLS, id));
}

// Calculate next due date based on frequency
function calculateNextDueDate(currentDate: Date, frequency: string): Date {
  const next = new Date(currentDate);
  
  switch (frequency) {
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
    case 'one_time':
    default:
      // No change for one-time bills
      break;
  }
  
  return next;
}

// Get bills needing reminder
export async function getBillsNeedingReminder(userId: string = DEFAULT_USER_ID): Promise<Bill[]> {
  const bills = await getUpcomingBills(30, userId);
  const now = new Date();
  
  return bills.filter(bill => {
    if (!bill.reminderEnabled || bill.isPaid) return false;
    
    const daysUntilDue = Math.ceil(
      (bill.dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
    );
    
    return daysUntilDue <= bill.reminderDaysBefore && daysUntilDue >= 0;
  });
}

// Get bill summary
export async function getBillSummary(userId: string = DEFAULT_USER_ID): Promise<{
  total: number;
  paid: number;
  unpaid: number;
  overdue: number;
  upcoming: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}> {
  const bills = await getBills(userId);
  const now = new Date();
  
  let paid = 0, unpaid = 0, overdue = 0, upcoming = 0;
  let paidAmount = 0, unpaidAmount = 0;
  
  for (const bill of bills) {
    if (bill.isPaid) {
      paid++;
      paidAmount += bill.paidAmount || bill.amount;
    } else {
      unpaid++;
      unpaidAmount += bill.amount;
      
      if (bill.dueDate < now) {
        overdue++;
      } else {
        upcoming++;
      }
    }
  }
  
  return {
    total: bills.length,
    paid,
    unpaid,
    overdue,
    upcoming,
    totalAmount: paidAmount + unpaidAmount,
    paidAmount,
    unpaidAmount,
  };
}

// Common Sri Lankan bill templates
export const BILL_TEMPLATES = [
  { name: 'CEB Electricity', nameSi: 'විදුලි බිල', nameTa: 'மின்சார கட்டணம்', category: 'Utilities', merchant: 'Ceylon Electricity Board' },
  { name: 'LECO Electricity', nameSi: 'ලෙකෝ බිල', nameTa: 'லெக்கோ கட்டணம்', category: 'Utilities', merchant: 'LECO' },
  { name: 'NWSDB Water', nameSi: 'ජල බිල', nameTa: 'நீர் கட்டணம்', category: 'Utilities', merchant: 'NWSDB' },
  { name: 'Dialog Mobile', nameSi: 'ඩයලොග් බිල', nameTa: 'டயலாக் கட்டணம்', category: 'Mobile & Internet', merchant: 'Dialog Axiata' },
  { name: 'Mobitel Mobile', nameSi: 'මොබිටෙල් බිල', nameTa: 'மொபிடெல் கட்டணம்', category: 'Mobile & Internet', merchant: 'Mobitel' },
  { name: 'SLT Fiber/Phone', nameSi: 'SLT බිල', nameTa: 'எஸ்எல்டி கட்டணம்', category: 'Mobile & Internet', merchant: 'SLT' },
  { name: 'Credit Card', nameSi: 'ක්‍රෙඩිට් කාඩ්', nameTa: 'கடன் அட்டை', category: 'Loans & EMI', merchant: '' },
  { name: 'House Rent', nameSi: 'නිවාස කුලිය', nameTa: 'வீட்டு வாடகை', category: 'Housing & Rent', merchant: '' },
  { name: 'Vehicle Loan', nameSi: 'වාහන ණය', nameTa: 'வாகன கடன்', category: 'Loans & EMI', merchant: '' },
  { name: 'Insurance Premium', nameSi: 'රක්ෂණ වාරික', nameTa: 'காப்பீட்டு பிரீமியம்', category: 'Insurance', merchant: '' },
];
