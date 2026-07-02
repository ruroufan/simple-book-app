import type { Expense } from '../types';
import { ExpenseCard } from '../components/ExpenseCard';
import { useLanguage } from '../context/LanguageContext';
import { sortByDateDesc } from '../utils/expenseUtils';

type ExpenseListProps = {
  expenses: Expense[];
  onSelectExpense: (expenseId: string) => void;
};

export function ExpenseList({ expenses, onSelectExpense }: ExpenseListProps) {
  const { t } = useLanguage();
  const sortedExpenses = sortByDateDesc(expenses);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-950">{t.list.title}</h1>
      {sortedExpenses.length > 0 ? (
        <div className="space-y-3">
          {sortedExpenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} onClick={() => onSelectExpense(expense.id)} />
          ))}
        </div>
      ) : (
        <p className="rounded-3xl bg-white p-5 text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">{t.list.empty}</p>
      )}
    </div>
  );
}
