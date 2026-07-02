import { StatBar } from '../components/StatBar';
import { useLanguage } from '../context/LanguageContext';
import { calculateExpenseStats } from '../services/expenseStats';
import type { Expense } from '../types';
import { formatCurrency } from '../utils/expenseUtils';
import { useState } from 'react';

type StatsProps = {
  expenses: Expense[];
};

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function Stats({ expenses }: StatsProps) {
  const { t } = useLanguage();
  const [month, setMonth] = useState(currentMonth());
  const stats = calculateExpenseStats(expenses, month);
  const maxDailyAmount = Math.max(...stats.last7Days.map((day) => day.amount), 1);

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-950">{t.stats.title}</h1>
        <label className="min-w-0 text-sm font-semibold text-gray-500">
          <span className="sr-only">{t.stats.month}</span>
          <input
            className="w-36 rounded-2xl bg-white px-3 py-2 text-gray-950 shadow-sm ring-1 ring-gray-100"
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
          />
        </label>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <p className="text-xs font-medium text-gray-500">{t.stats.monthTotal}</p>
          <p className="mt-2 text-2xl font-bold text-gray-950">{formatCurrency(stats.monthTotal)}</p>
        </div>
        <div className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <p className="text-xs font-medium text-gray-500">{t.stats.todayTotal}</p>
          <p className="mt-2 text-2xl font-bold text-gray-950">{formatCurrency(stats.todayTotal)}</p>
        </div>
        <div className="col-span-2 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <p className="text-xs font-medium text-gray-500">{t.stats.monthCount}</p>
          <p className="mt-2 text-2xl font-bold text-gray-950">{stats.monthCount}</p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-950">{t.stats.byCategory}</h2>
        {stats.categoryTotals.length > 0 ? (
          <div className="space-y-3">
            {stats.categoryTotals.map((item) => (
              <StatBar key={item.category} amount={item.amount} category={item.category} percent={item.percent} />
            ))}
          </div>
        ) : (
          <p className="rounded-3xl bg-white p-5 text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
            {t.stats.empty}
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold text-gray-950">{t.stats.last7Days}</h2>
        <div className="space-y-2 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
          {stats.last7Days.map((day) => (
            <div key={day.date} className="grid grid-cols-[4.5rem_1fr_5rem] items-center gap-3 text-sm">
              <span className="text-xs font-semibold text-gray-500">{day.date.slice(5)}</span>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-gray-950"
                  style={{ width: `${Math.max((day.amount / maxDailyAmount) * 100, day.amount > 0 ? 3 : 0)}%` }}
                />
              </div>
              <span className="text-right text-xs font-bold text-gray-700">{formatCurrency(day.amount)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
