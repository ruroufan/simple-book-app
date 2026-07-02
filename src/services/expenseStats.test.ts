import { describe, expect, it } from 'vitest';
import type { Expense } from '../types';
import { calculateExpenseStats } from './expenseStats';

const baseExpense = {
  paymentMethod: 'electronic',
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
} as const;

describe('expense stats', () => {
  it('calculates month totals, today total, category totals and last 7 days from real expenses', () => {
    const expenses: Expense[] = [
      { ...baseExpense, id: '1', amount: 1000, category: 'food', date: '2026-07-01' },
      { ...baseExpense, id: '2', amount: 2500, category: 'daily', date: '2026-07-01' },
      { ...baseExpense, id: '3', amount: 800, category: 'food', date: '2026-06-30' },
    ];

    const stats = calculateExpenseStats(expenses, '2026-07', '2026-07-01');

    expect(stats.monthTotal).toBe(3500);
    expect(stats.todayTotal).toBe(3500);
    expect(stats.monthCount).toBe(2);
    expect(stats.categoryTotals).toEqual([
      { category: 'daily', amount: 2500, percent: 71.42857142857143 },
      { category: 'food', amount: 1000, percent: 28.57142857142857 },
    ]);
    expect(stats.last7Days[6]).toEqual({ date: '2026-07-01', amount: 3500 });
  });
});
