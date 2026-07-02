import type { ExpenseCategory } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency } from '../utils/expenseUtils';

type StatBarProps = {
  category: ExpenseCategory;
  amount: number;
  percent: number;
};

export function StatBar({ category, amount, percent }: StatBarProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between gap-3">
        <span className="font-semibold text-gray-900">{t.categories[category]}</span>
        <span className="text-sm font-semibold text-gray-700">{formatCurrency(amount)}</span>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gray-900 transition-all"
          style={{ width: `${Math.max(percent, 2)}%` }}
        />
      </div>
      <p className="mt-2 text-right text-xs text-gray-500">{percent.toFixed(0)}%</p>
    </div>
  );
}
