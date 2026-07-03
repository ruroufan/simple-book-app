import { afterEach, describe, expect, it, vi } from 'vitest';
import { addExpense, getExpenses } from './storage';
import type { Expense } from '../types';

const expense: Expense = {
  id: 'expense-1',
  amount: 1280,
  category: 'food',
  date: '2026-07-03',
  paymentMethod: 'electronic',
  createdAt: '2026-07-03T00:00:00.000Z',
  updatedAt: '2026-07-03T00:00:00.000Z',
};

function stubStorageThatRejectsBackup() {
  const store = new Map<string, string>();

  vi.stubGlobal('window', {});
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (key === 'simplebook_backup_latest') {
        throw new DOMException('Quota exceeded', 'QuotaExceededError');
      }
      store.set(key, value);
    },
    removeItem: (key: string) => store.delete(key),
  });
}

describe('expense storage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps the expense saved when the automatic local backup exceeds storage quota', () => {
    stubStorageThatRejectsBackup();

    expect(() => addExpense(expense)).not.toThrow();
    expect(getExpenses()).toHaveLength(1);
  });
});
