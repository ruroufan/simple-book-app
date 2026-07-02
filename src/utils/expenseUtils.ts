import type { Expense, Language } from '../types';

export function formatCurrency(amount: number) {
  return `¥${Math.round(amount).toLocaleString('ja-JP')}`;
}

export function formatDate(date: string, language: Language) {
  return new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'ja-JP', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function isThisMonth(date: string) {
  const target = new Date(`${date}T00:00:00`);
  const now = new Date();
  return target.getFullYear() === now.getFullYear() && target.getMonth() === now.getMonth();
}

export function sumExpenses(expenses: Expense[]) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function sortByDateDesc(expenses: Expense[]) {
  return [...expenses].sort((a, b) => {
    const dateDiff = b.date.localeCompare(a.date);
    return dateDiff || b.updatedAt.localeCompare(a.updatedAt);
  });
}
