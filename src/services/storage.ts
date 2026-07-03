import type { Expense } from '../types';
import { writeLatestBackup } from './backup';
import { requestCloudSync } from './cloudSync';
import { setPersistentData } from './persistentStorage';

const EXPENSES_KEY = 'minimal-expense-records';

export function getExpenses(): Expense[] {
  const raw = localStorage.getItem(EXPENSES_KEY);
  if (!raw) {
    return [];
  }

  try {
    const expenses = JSON.parse(raw) as Partial<Expense>[];
    return Array.isArray(expenses) ? expenses.map(normalizeExpense).filter(isExpense) : [];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]) {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  void setPersistentData('expenses', expenses).catch(() => undefined);
  writeLatestBackup();
  requestCloudSync();
}

export function addExpense(expense: Expense) {
  const nextExpenses = [expense, ...getExpenses()];
  saveExpenses(nextExpenses);
  return nextExpenses;
}

export function updateExpense(updatedExpense: Expense) {
  const nextExpenses = getExpenses().map((expense) =>
    expense.id === updatedExpense.id ? updatedExpense : expense,
  );
  saveExpenses(nextExpenses);
  return nextExpenses;
}

export function deleteExpense(expenseId: string) {
  const nextExpenses = getExpenses().filter((expense) => expense.id !== expenseId);
  saveExpenses(nextExpenses);
  return nextExpenses;
}

function normalizeExpense(expense: Partial<Expense>): Expense | null {
  if (!expense.id || !expense.amount || !expense.category || !expense.date) {
    return null;
  }

  const createdAt = expense.createdAt ?? new Date().toISOString();

  return {
    id: expense.id,
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    time: expense.time,
    paymentMethod: expense.paymentMethod ?? 'electronic',
    storeName: expense.storeName,
    note: expense.note,
    receiptImageUrl: expense.receiptImageUrl,
    createdAt,
    updatedAt: expense.updatedAt ?? createdAt,
  } satisfies Expense;
}

function isExpense(expense: Expense | null): expense is Expense {
  return expense !== null;
}
