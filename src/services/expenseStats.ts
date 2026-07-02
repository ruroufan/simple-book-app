import { categoryKeys } from '../i18n/translations';
import type { Expense, ExpenseCategory } from '../types';

export type ExpenseStats = {
  monthExpenses: Expense[];
  monthTotal: number;
  todayTotal: number;
  monthCount: number;
  categoryTotals: Array<{ category: ExpenseCategory; amount: number; percent: number }>;
  last7Days: Array<{ date: string; amount: number }>;
};

export function calculateExpenseStats(expenses: Expense[], month: string, today = new Date().toISOString().slice(0, 10)): ExpenseStats {
  const monthExpenses = filterExpensesByMonth(expenses, month);
  const monthTotal = sum(monthExpenses);
  const todayTotal = sum(expenses.filter((expense) => expense.date === today));
  const categoryTotals = categoryKeys
    .map((category) => {
      const amount = sum(monthExpenses.filter((expense) => expense.category === category));
      return {
        category,
        amount,
        percent: monthTotal > 0 ? (amount / monthTotal) * 100 : 0,
      };
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return {
    monthExpenses,
    monthTotal,
    todayTotal,
    monthCount: monthExpenses.length,
    categoryTotals,
    last7Days: getLast7Days(expenses, today),
  };
}

export function filterExpensesByMonth(expenses: Expense[], month: string) {
  return expenses.filter((expense) => expense.date.startsWith(month));
}

function getLast7Days(expenses: Expense[], today: string) {
  const baseDate = new Date(`${today}T00:00:00`);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() - (6 - index));
    const dateString = toDateString(date);
    return {
      date: dateString,
      amount: sum(expenses.filter((expense) => expense.date === dateString)),
    };
  });
}

function sum(expenses: Expense[]) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

function toDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
