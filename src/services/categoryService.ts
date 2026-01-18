// Category Service - Manage expense/income categories
// Includes default categories for Sri Lankan context

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
  setDoc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { firestore, COLLECTIONS, DEFAULT_USER_ID } from '@/lib/firebase';
import type { Category, CategoryInput } from '@/types';

// Default categories for Sri Lankan users
export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Expense Categories
  { userId: '', name: 'Food & Dining', nameSi: 'ආහාර', nameTa: 'உணவு', icon: '🍛', color: '#ef4444', type: 'expense', isDefault: true, isActive: true, sortOrder: 1 },
  { userId: '', name: 'Groceries', nameSi: 'සිල්ලර භාණ්ඩ', nameTa: 'மளிகை', icon: '🛒', color: '#f97316', type: 'expense', isDefault: true, isActive: true, sortOrder: 2 },
  { userId: '', name: 'Transportation', nameSi: 'ප්‍රවාහනය', nameTa: 'போக்குவரத்து', icon: '🚌', color: '#eab308', type: 'expense', isDefault: true, isActive: true, sortOrder: 3 },
  { userId: '', name: 'Fuel', nameSi: 'ඉන්ධන', nameTa: 'எரிபொருள்', icon: '⛽', color: '#84cc16', type: 'expense', isDefault: true, isActive: true, sortOrder: 4 },
  { userId: '', name: 'Utilities', nameSi: 'උපයෝගීතා', nameTa: 'பயன்பாடுகள்', icon: '💡', color: '#22c55e', type: 'expense', isDefault: true, isActive: true, sortOrder: 5 },
  { userId: '', name: 'Mobile & Internet', nameSi: 'දුරකථන', nameTa: 'தொலைபேசி', icon: '📱', color: '#14b8a6', type: 'expense', isDefault: true, isActive: true, sortOrder: 6 },
  { userId: '', name: 'Healthcare', nameSi: 'සෞඛ්‍ය', nameTa: 'சுகாதாரம்', icon: '🏥', color: '#06b6d4', type: 'expense', isDefault: true, isActive: true, sortOrder: 7 },
  { userId: '', name: 'Education', nameSi: 'අධ්‍යාපනය', nameTa: 'கல்வி', icon: '📚', color: '#3b82f6', type: 'expense', isDefault: true, isActive: true, sortOrder: 8 },
  { userId: '', name: 'Shopping', nameSi: 'සාප්පු සවාරි', nameTa: 'ஷாப்பிங்', icon: '🛍️', color: '#6366f1', type: 'expense', isDefault: true, isActive: true, sortOrder: 9 },
  { userId: '', name: 'Entertainment', nameSi: 'විනෝදාස්වාදය', nameTa: 'பொழுதுபோக்கு', icon: '🎬', color: '#8b5cf6', type: 'expense', isDefault: true, isActive: true, sortOrder: 10 },
  { userId: '', name: 'Housing & Rent', nameSi: 'නිවාස කුලිය', nameTa: 'வீட்டு வாடகை', icon: '🏠', color: '#a855f7', type: 'expense', isDefault: true, isActive: true, sortOrder: 11 },
  { userId: '', name: 'Insurance', nameSi: 'රක්ෂණ', nameTa: 'காப்பீடு', icon: '🛡️', color: '#d946ef', type: 'expense', isDefault: true, isActive: true, sortOrder: 12 },
  { userId: '', name: 'Personal Care', nameSi: 'පුද්ගලික සත්කාර', nameTa: 'தனிப்பட்ட பராமரிப்பு', icon: '💆', color: '#ec4899', type: 'expense', isDefault: true, isActive: true, sortOrder: 13 },
  { userId: '', name: 'Donations & Temple', nameSi: 'පූජා/දන්සැල', nameTa: 'கோயில்/தானம்', icon: '🙏', color: '#f43f5e', type: 'expense', isDefault: true, isActive: true, sortOrder: 14 },
  { userId: '', name: 'Loans & EMI', nameSi: 'ණය', nameTa: 'கடன்', icon: '🏦', color: '#78716c', type: 'expense', isDefault: true, isActive: true, sortOrder: 15 },
  
  // Income Categories
  { userId: '', name: 'Salary', nameSi: 'වැටුප', nameTa: 'சம்பளம்', icon: '💰', color: '#10b981', type: 'income', isDefault: true, isActive: true, sortOrder: 1 },
  { userId: '', name: 'Freelance', nameSi: 'ස්වයං රැකියා', nameTa: 'சுயதொழில்', icon: '💻', color: '#059669', type: 'income', isDefault: true, isActive: true, sortOrder: 2 },
  { userId: '', name: 'Business', nameSi: 'ව්‍යාපාර', nameTa: 'வணிகம்', icon: '🏪', color: '#047857', type: 'income', isDefault: true, isActive: true, sortOrder: 3 },
  { userId: '', name: 'Interest', nameSi: 'පොලී', nameTa: 'வட்டி', icon: '📈', color: '#0d9488', type: 'income', isDefault: true, isActive: true, sortOrder: 4 },
  { userId: '', name: 'Rental Income', nameSi: 'කුලී ආදායම', nameTa: 'வாடகை வருமானம்', icon: '🏘️', color: '#0891b2', type: 'income', isDefault: true, isActive: true, sortOrder: 5 },
  { userId: '', name: 'Gifts', nameSi: 'තෑගි', nameTa: 'பரிசுகள்', icon: '🎁', color: '#0284c7', type: 'income', isDefault: true, isActive: true, sortOrder: 6 },
  { userId: '', name: 'Other Income', nameSi: 'වෙනත් ආදායම', nameTa: 'பிற வருமானம்', icon: '💵', color: '#2563eb', type: 'income', isDefault: true, isActive: true, sortOrder: 7 },
  
  // Special Categories
  { userId: '', name: 'Transfer', nameSi: 'මාරු', nameTa: 'பரிமாற்றம்', icon: '🔄', color: '#64748b', type: 'both', isDefault: true, isActive: true, sortOrder: 99 },
  { userId: '', name: 'Uncategorized', nameSi: 'වර්ග නොකළ', nameTa: 'வகைப்படுத்தப்படாத', icon: '❓', color: '#94a3b8', type: 'both', isDefault: true, isActive: true, sortOrder: 100 },
];

// Convert Firestore document to Category
function docToCategory(doc: any): Category {
  const data = doc.data();
  return {
    id: doc.id,
    userId: data.userId,
    name: data.name,
    nameSi: data.nameSi,
    nameTa: data.nameTa,
    icon: data.icon,
    color: data.color,
    type: data.type,
    parentId: data.parentId,
    budget: data.budget,
    isDefault: data.isDefault || false,
    isActive: data.isActive !== false,
    sortOrder: data.sortOrder || 0,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
}

// Get all categories for a user
export async function getCategories(userId: string = DEFAULT_USER_ID): Promise<Category[]> {
  const q = query(
    collection(firestore, COLLECTIONS.CATEGORIES),
    where('userId', '==', userId),
    where('isActive', '==', true),
    orderBy('sortOrder', 'asc')
  );
  const snapshot = await getDocs(q);
  
  // If no categories exist, initialize defaults
  if (snapshot.empty) {
    await initializeDefaultCategories(userId);
    return getCategories(userId);
  }
  
  return snapshot.docs.map(docToCategory);
}

// Get categories by type
export async function getCategoriesByType(
  type: 'income' | 'expense' | 'both',
  userId: string = DEFAULT_USER_ID
): Promise<Category[]> {
  const categories = await getCategories(userId);
  return categories.filter(c => c.type === type || c.type === 'both');
}

// Get single category
export async function getCategory(id: string): Promise<Category | null> {
  const docRef = doc(firestore, COLLECTIONS.CATEGORIES, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docToCategory(docSnap) : null;
}

// Add custom category
export async function addCategory(
  input: CategoryInput,
  userId: string = DEFAULT_USER_ID
): Promise<string> {
  const docRef = await addDoc(collection(firestore, COLLECTIONS.CATEGORIES), {
    ...input,
    userId,
    isDefault: false,
    isActive: true,
    sortOrder: 50,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// Update category
export async function updateCategory(id: string, data: Partial<CategoryInput>): Promise<void> {
  await updateDoc(doc(firestore, COLLECTIONS.CATEGORIES, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Delete category (soft delete)
export async function deleteCategory(id: string): Promise<void> {
  await updateDoc(doc(firestore, COLLECTIONS.CATEGORIES, id), {
    isActive: false,
    updatedAt: serverTimestamp(),
  });
}

// Initialize default categories for a user
export async function initializeDefaultCategories(userId: string): Promise<void> {
  const batch = writeBatch(firestore);
  const now = serverTimestamp();
  
  for (const category of DEFAULT_CATEGORIES) {
    const docRef = doc(collection(firestore, COLLECTIONS.CATEGORIES));
    batch.set(docRef, {
      ...category,
      userId,
      createdAt: now,
      updatedAt: now,
    });
  }
  
  await batch.commit();
}

// Get category by name (for SMS parsing)
export async function getCategoryByName(
  name: string,
  userId: string = DEFAULT_USER_ID
): Promise<Category | null> {
  const categories = await getCategories(userId);
  const normalized = name.toLowerCase();
  return categories.find(c => 
    c.name.toLowerCase() === normalized ||
    c.nameSi?.toLowerCase() === normalized ||
    c.nameTa?.toLowerCase() === normalized
  ) || null;
}

// Map SMS category string to category ID
export async function mapCategoryName(
  categoryName: string,
  userId: string = DEFAULT_USER_ID
): Promise<{ categoryId: string; category: string } | null> {
  // Common SMS category mappings
  const categoryMappings: Record<string, string> = {
    'purchase': 'Shopping',
    'shopping': 'Shopping',
    'food': 'Food & Dining',
    'grocery': 'Groceries',
    'fuel': 'Fuel',
    'petrol': 'Fuel',
    'utility': 'Utilities',
    'electricity': 'Utilities',
    'water': 'Utilities',
    'mobile': 'Mobile & Internet',
    'internet': 'Mobile & Internet',
    'transfer': 'Transfer',
    'withdrawal': 'Transfer',
    'atm': 'Transfer',
    'uncategorized': 'Uncategorized',
  };
  
  const mappedName = categoryMappings[categoryName.toLowerCase()] || categoryName;
  const category = await getCategoryByName(mappedName, userId);
  
  if (category) {
    return { categoryId: category.id, category: category.name };
  }
  
  // Return uncategorized if no match
  const uncategorized = await getCategoryByName('Uncategorized', userId);
  return uncategorized 
    ? { categoryId: uncategorized.id, category: uncategorized.name }
    : null;
}
