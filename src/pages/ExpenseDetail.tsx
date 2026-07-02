import { useState } from 'react';
import { ExpenseForm } from '../components/ExpenseForm';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency, formatDate } from '../utils/expenseUtils';
import type { Expense } from '../types';

type ExpenseDetailProps = {
  expense: Expense;
  onBack: () => void;
  onDelete: (expenseId: string) => void;
  onUpdate: (expense: Expense) => void;
};

export function ExpenseDetail({ expense, onBack, onDelete, onUpdate }: ExpenseDetailProps) {
  const { language, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ExpenseForm
        expense={expense}
        mode="edit"
        onCancel={() => setIsEditing(false)}
        onSave={(nextExpense) => {
          onUpdate(nextExpense);
          setIsEditing(false);
        }}
      />
    );
  }

  function handleDelete() {
    if (window.confirm(t.detail.deleteConfirm)) {
      onDelete(expense.id);
    }
  }

  const rowClass = 'flex items-center justify-between gap-4 border-b border-gray-100 py-3 text-sm last:border-b-0';

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <button className="rounded-full px-3 py-2 text-sm font-semibold text-gray-500" type="button" onClick={onBack}>
          {t.detail.back}
        </button>
        <h1 className="text-xl font-bold text-gray-950">{t.detail.title}</h1>
        <button
          className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white"
          type="button"
          onClick={() => setIsEditing(true)}
        >
          {t.detail.edit}
        </button>
      </header>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <p className="text-sm text-gray-500">{t.categories[expense.category]}</p>
        <p className="mt-2 text-4xl font-bold text-gray-950">{formatCurrency(expense.amount)}</p>
      </section>

      <section className="rounded-[2rem] bg-white px-5 shadow-sm ring-1 ring-gray-100">
        <div className={rowClass}>
          <span className="text-gray-500">{t.form.date}</span>
          <span className="font-semibold text-gray-950">{formatDate(expense.date, language)}</span>
        </div>
        <div className={rowClass}>
          <span className="text-gray-500">{t.form.time}</span>
          <span className="font-semibold text-gray-950">{expense.time || t.common.noStore}</span>
        </div>
        <div className={rowClass}>
          <span className="text-gray-500">{t.form.storeName}</span>
          <span className="font-semibold text-gray-950">{expense.storeName || t.common.noStore}</span>
        </div>
        <div className={rowClass}>
          <span className="text-gray-500">{t.form.note}</span>
          <span className="font-semibold text-gray-950">{expense.note || t.common.noStore}</span>
        </div>
        <div className={rowClass}>
          <span className="text-gray-500">{t.form.paymentMethod}</span>
          <span className="font-semibold text-gray-950">{t.paymentMethods[expense.paymentMethod]}</span>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <h2 className="text-sm font-semibold text-gray-600">{t.detail.receipt}</h2>
        {expense.receiptImageUrl ? (
          <img
            className="mt-3 max-h-96 w-full rounded-3xl object-cover"
            alt={t.detail.receipt}
            src={expense.receiptImageUrl}
          />
        ) : (
          <p className="mt-3 text-sm text-gray-500">{t.detail.noReceipt}</p>
        )}
      </section>

      <button
        className="w-full rounded-3xl bg-red-50 px-5 py-4 text-base font-bold text-red-600"
        type="button"
        onClick={handleDelete}
      >
        {t.detail.delete}
      </button>
    </div>
  );
}
