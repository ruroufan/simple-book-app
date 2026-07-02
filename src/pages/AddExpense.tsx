import { ExpenseForm } from '../components/ExpenseForm';
import type { Expense } from '../types';

type AddExpenseProps = {
  onSave: (expense: Expense) => void;
  onCancel: () => void;
};

export function AddExpense({ onSave, onCancel }: AddExpenseProps) {
  return <ExpenseForm mode="create" onCancel={onCancel} onSave={onSave} />;
}
