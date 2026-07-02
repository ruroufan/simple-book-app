import type { Expense } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency, formatDate } from '../utils/expenseUtils';

type ExpenseCardProps = {
  expense: Expense;
  onClick?: (expense: Expense) => void;
};

export function ExpenseCard({ expense, onClick }: ExpenseCardProps) {
  const { language, t } = useLanguage();
  const title = expense.storeName || expense.note || t.common.noStore;
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-left">
          <p className="truncate text-base font-semibold text-gray-950">{title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700">
              {t.categories[expense.category]}
            </span>
            <span>
              {expense.time ? expense.time : formatDate(expense.date, language)}
            </span>
            {expense.receiptImageUrl ? <span>{t.list.receipt}</span> : null}
          </div>
        </div>
        <p className="shrink-0 text-lg font-bold text-gray-950">{formatCurrency(expense.amount)}</p>
      </div>
      {expense.receiptImageUrl ? (
        <img
          alt={t.form.receipt}
          className="mt-3 h-28 w-full rounded-2xl object-cover"
          src={expense.receiptImageUrl}
        />
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button
        className="block w-full rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition hover:bg-gray-50"
        type="button"
        onClick={() => onClick(expense)}
      >
        {content}
      </button>
    );
  }

  return <article className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100">{content}</article>;
}
