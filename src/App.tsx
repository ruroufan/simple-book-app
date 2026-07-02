import { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { InstallPrompt } from './components/InstallPrompt';
import { ScheduleForm } from './components/ScheduleForm';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { addExpense, deleteExpense, getExpenses, updateExpense } from './services/storage';
import { addSchedule, deleteSchedule, getSchedules, updateSchedule } from './services/scheduleStorage';
import {
  deleteStoreCategoryMemory,
  getStoreCategoryMemories,
  updateStoreCategoryMemory,
  upsertStoreCategoryMemory,
} from './services/storeCategoryMemory';
import { AddExpense } from './pages/AddExpense';
import { Dashboard } from './pages/Dashboard';
import { ExpenseDetail } from './pages/ExpenseDetail';
import { ExpenseList } from './pages/ExpenseList';
import { ScheduleDetail } from './pages/ScheduleDetail';
import { SchedulePage } from './pages/SchedulePage';
import { Settings } from './pages/Settings';
import { Stats } from './pages/Stats';
import { StoreMemoryPage } from './pages/StoreMemoryPage';
import type { Expense, ExpenseCategory, Page } from './types';
import type { Schedule } from './types/schedule';
import type { StoreCategoryMemory } from './types/storeMemory';

function AppShell() {
  const { t } = useLanguage();
  const [page, setPage] = useState<Page>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [storeMemories, setStoreMemories] = useState<StoreCategoryMemory[]>([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [scheduleFormDate, setScheduleFormDate] = useState<string | undefined>();

  useEffect(() => {
    setExpenses(getExpenses());
    setSchedules(getSchedules());
    setStoreMemories(getStoreCategoryMemories());
  }, []);

  function learnStoreCategory(expense: Expense) {
    if (expense.storeName) {
      setStoreMemories(upsertStoreCategoryMemory(expense.storeName, expense.category));
    }
  }

  function handleSaveExpense(expense: Expense) {
    const nextExpenses = addExpense(expense);
    learnStoreCategory(expense);
    setExpenses(nextExpenses);
    setPage('dashboard');
  }

  function handleUpdateExpense(expense: Expense) {
    const nextExpenses = updateExpense(expense);
    learnStoreCategory(expense);
    setExpenses(nextExpenses);
    setSelectedExpenseId(expense.id);
    setPage('detail');
  }

  function handleDeleteExpense(expenseId: string) {
    const nextExpenses = deleteExpense(expenseId);
    setExpenses(nextExpenses);
    setSelectedExpenseId(null);
    setPage('list');
  }

  function openExpenseDetail(expenseId: string) {
    setSelectedExpenseId(expenseId);
    setPage('detail');
  }

  function handleSaveSchedule(schedule: Schedule) {
    const nextSchedules = addSchedule(schedule);
    setSchedules(nextSchedules);
    setSelectedScheduleId(schedule.id);
    setPage('scheduleDetail');
  }

  function handleUpdateSchedule(schedule: Schedule) {
    const nextSchedules = updateSchedule(schedule);
    setSchedules(nextSchedules);
    setSelectedScheduleId(schedule.id);
    setPage('scheduleDetail');
  }

  function handleDeleteSchedule(scheduleId: string) {
    const nextSchedules = deleteSchedule(scheduleId);
    setSchedules(nextSchedules);
    setSelectedScheduleId(null);
    setPage('schedule');
  }

  function openScheduleAdd(date: string) {
    setScheduleFormDate(date);
    setPage('scheduleAdd');
  }

  function openScheduleDetail(scheduleId: string) {
    setSelectedScheduleId(scheduleId);
    setPage('scheduleDetail');
  }

  function handleUpdateMemory(memoryId: string, category: ExpenseCategory) {
    setStoreMemories(updateStoreCategoryMemory(memoryId, category));
  }

  function handleDeleteMemory(memoryId: string) {
    setStoreMemories(deleteStoreCategoryMemory(memoryId));
  }

  const selectedExpense = expenses.find((expense) => expense.id === selectedExpenseId);
  const selectedSchedule = schedules.find((schedule) => schedule.id === selectedScheduleId);

  const pageContent = {
    dashboard: <Dashboard expenses={expenses} onAdd={() => setPage('add')} />,
    add: <AddExpense onCancel={() => setPage('dashboard')} onSave={handleSaveExpense} />,
    list: <ExpenseList expenses={expenses} onSelectExpense={openExpenseDetail} />,
    detail: selectedExpense ? (
      <ExpenseDetail
        expense={selectedExpense}
        onBack={() => setPage('list')}
        onDelete={handleDeleteExpense}
        onUpdate={handleUpdateExpense}
      />
    ) : (
      <ExpenseList expenses={expenses} onSelectExpense={openExpenseDetail} />
    ),
    schedule: (
      <SchedulePage
        expenses={expenses}
        schedules={schedules}
        onAdd={openScheduleAdd}
        onSelectExpense={openExpenseDetail}
        onSelectSchedule={openScheduleDetail}
      />
    ),
    scheduleAdd: (
      <ScheduleForm
        initialDate={scheduleFormDate}
        mode="create"
        onCancel={() => setPage('schedule')}
        onSave={handleSaveSchedule}
      />
    ),
    scheduleDetail: selectedSchedule ? (
      <ScheduleDetail
        schedule={selectedSchedule}
        onBack={() => setPage('schedule')}
        onDelete={handleDeleteSchedule}
        onUpdate={handleUpdateSchedule}
      />
    ) : (
      <SchedulePage
        expenses={expenses}
        schedules={schedules}
        onAdd={openScheduleAdd}
        onSelectExpense={openExpenseDetail}
        onSelectSchedule={openScheduleDetail}
      />
    ),
    storeMemory: (
      <StoreMemoryPage
        memories={storeMemories}
        onBack={() => setPage('settings')}
        onDelete={handleDeleteMemory}
        onUpdate={handleUpdateMemory}
      />
    ),
    stats: <Stats expenses={expenses} />,
    settings: <Settings onOpenStoreMemory={() => setPage('storeMemory')} />,
  }[page];

  const showBottomNav =
    page === 'dashboard' || page === 'list' || page === 'schedule' || page === 'stats' || page === 'settings';

  return (
    <div className="min-h-screen bg-gray-200 px-3 py-4 text-gray-950">
      <main className="relative mx-auto flex h-[calc(100vh-2rem)] max-h-[920px] min-h-[680px] w-full max-w-[430px] flex-col overflow-hidden rounded-[2.5rem] bg-gray-50 shadow-2xl ring-1 ring-black/5">
        <div className="flex items-center justify-between px-6 pb-3 pt-6">
          <p className="text-sm font-bold text-gray-950">{t.appName}</p>
          <div className="h-1.5 w-16 rounded-full bg-gray-200" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-28 pt-2">{pageContent}</div>

        {showBottomNav ? (
          <div className="absolute bottom-0 left-0 right-0">
            <InstallPrompt />
            <BottomNav currentPage={page} onNavigate={setPage} />
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  );
}
