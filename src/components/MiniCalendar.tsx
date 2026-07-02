import type { Expense } from '../types';
import type { Schedule } from '../types/schedule';

type MiniCalendarProps = {
  month: Date;
  schedules: Schedule[];
  expenses: Expense[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
};

const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

export function MiniCalendar({ month, schedules, expenses, selectedDate, onSelectDate }: MiniCalendarProps) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const today = toDateString(new Date());
  const scheduleDates = new Set(schedules.map((schedule) => schedule.date));
  const expenseDates = new Set(expenses.map((expense) => expense.date));
  const cells = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  return (
    <section className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400">
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const date = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = selectedDate === date;
          const isToday = today === date;
          const hasSchedule = scheduleDates.has(date);
          const hasExpense = expenseDates.has(date);

          return (
            <button
              key={date}
              className={`flex aspect-square flex-col items-center justify-center rounded-2xl text-sm font-semibold transition ${
                isSelected
                  ? 'bg-gray-950 text-white'
                  : isToday
                    ? 'bg-gray-100 text-gray-950 ring-1 ring-gray-300'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
              type="button"
              onClick={() => onSelectDate(date)}
            >
              <span>{day}</span>
              <span className="mt-1 flex h-2 items-center gap-0.5">
                <span className={`h-1.5 w-1.5 rounded-full ${hasSchedule ? 'bg-current' : 'bg-transparent'}`} />
                <span className={`h-1.5 w-1.5 rounded-full ${hasExpense ? 'bg-current opacity-50' : 'bg-transparent'}`} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function toDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
