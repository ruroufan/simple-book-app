import { useMemo, useState } from 'react';
import { MiniCalendar } from '../components/MiniCalendar';
import { ExpenseCard } from '../components/ExpenseCard';
import { useLanguage } from '../context/LanguageContext';
import type { Expense } from '../types';
import type { Schedule } from '../types/schedule';

type SchedulePageProps = {
  expenses: Expense[];
  schedules: Schedule[];
  onAdd: (date: string) => void;
  onSelectExpense: (expenseId: string) => void;
  onSelectSchedule: (scheduleId: string) => void;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatMonth(date: Date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
}

export function SchedulePage({ expenses, schedules, onAdd, onSelectExpense, onSelectSchedule }: SchedulePageProps) {
  const { t } = useLanguage();
  const [month, setMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(today());
  const selectedSchedules = useMemo(
    () =>
      schedules
        .filter((schedule) => schedule.date === selectedDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [schedules, selectedDate],
  );
  const selectedExpenses = useMemo(
    () =>
      expenses
        .filter((expense) => expense.date === selectedDate)
        .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? '')),
    [expenses, selectedDate],
  );

  function moveMonth(offset: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <button className="rounded-full bg-white px-4 py-2 text-lg font-bold text-gray-700 shadow-sm" type="button" onClick={() => moveMonth(-1)}>
          ‹
        </button>
        <h1 className="text-2xl font-bold text-gray-950">{formatMonth(month)}</h1>
        <button className="rounded-full bg-white px-4 py-2 text-lg font-bold text-gray-700 shadow-sm" type="button" onClick={() => moveMonth(1)}>
          ›
        </button>
      </header>

      <MiniCalendar
        expenses={expenses}
        month={month}
        schedules={schedules}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <button
        className="w-full rounded-3xl bg-gray-950 px-5 py-4 text-lg font-bold text-white shadow-sm"
        type="button"
        onClick={() => onAdd(selectedDate)}
      >
        {t.schedule.addTitle}
      </button>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-950">{t.schedule.selectedScheduleTitle}</h2>
        {selectedSchedules.length > 0 ? (
          selectedSchedules.map((schedule) => (
            <button
              key={schedule.id}
              className="block w-full rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-100 transition hover:bg-gray-50"
              type="button"
              onClick={() => onSelectSchedule(schedule.id)}
            >
              <p className="text-sm font-bold text-gray-500">
                {schedule.startTime}
                {schedule.endTime ? ` - ${schedule.endTime}` : ''}
              </p>
              <p className="mt-1 truncate text-base font-bold text-gray-950">{schedule.title}</p>
              {schedule.note ? <p className="mt-1 line-clamp-2 text-sm text-gray-500">{schedule.note}</p> : null}
            </button>
          ))
        ) : (
          <p className="rounded-3xl bg-white p-5 text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
            {t.schedule.empty}
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-950">{t.schedule.selectedExpenseTitle}</h2>
        {selectedExpenses.length > 0 ? (
          selectedExpenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} onClick={() => onSelectExpense(expense.id)} />
          ))
        ) : (
          <p className="rounded-3xl bg-white p-5 text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
            {t.schedule.noExpenses}
          </p>
        )}
      </section>
    </div>
  );
}
