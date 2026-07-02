import type { Expense } from '../types';
import { ExpenseCard } from '../components/ExpenseCard';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency, isThisMonth, sortByDateDesc, sumExpenses } from '../utils/expenseUtils';

type DashboardProps = {
  expenses: Expense[];
  onAdd: () => void;
};

export function Dashboard({ expenses, onAdd }: DashboardProps) {
  const { t } = useLanguage();
  const monthExpenses = expenses.filter((expense) => isThisMonth(expense.date));
  const recentExpenses = sortByDateDesc(expenses).slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] bg-gray-950 p-6 text-white shadow-sm">
        <p className="text-sm text-gray-300">{t.dashboard.monthTotal}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal">
          {formatCurrency(sumExpenses(monthExpenses))}
        </h1>
      </section>

      <button
        className="w-full rounded-3xl bg-white px-5 py-4 text-lg font-bold text-gray-950 shadow-sm ring-1 ring-gray-100 transition hover:bg-gray-50"
        type="button"
        onClick={onAdd}
      >
        {t.dashboard.add}
      </button>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-950">{t.dashboard.recent}</h2>
        </div>

        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl bg-white p-5 text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
            {t.dashboard.empty}
          </p>
        )}
      </section>
    </div>
  );
}
