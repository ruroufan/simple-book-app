import { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { InstallPrompt } from './components/InstallPrompt';
import { ScheduleForm } from './components/ScheduleForm';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useSwipeBack } from './hooks/useSwipeBack';
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
  const [pageStack, setPageStack] = useState<Page[]>([]);

  useEffect(() => {
    setExpenses(getExpenses());
    setSchedules(getSchedules());
    setStoreMemories(getStoreCategoryMemories());
  }, []);

  function navigateTo(nextPage: Page) {
    setPageStack((stack) => (nextPage === page ? stack : [...stack, page]));
    setPage(nextPage);
  }

  function safeBack() {
    if (page === 'dashboard') {
      return;
    }

    const previousPage = pageStack[pageStack.length - 1];
    if (previousPage) {
      setPageStack((stack) => stack.slice(0, -1));
      setPage(previousPage);
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    setPage('dashboard');
  }

  useSwipeBack({
    enabled: page !== 'dashboard',
    edgeWidth: 40,
    threshold: 70,
    onBack: safeBack,
  });

  function learnStoreCategory(expense: Expense) {
    if (expense.storeName) {
      setStoreMemories(upsertStoreCategoryMemory(expense.storeName, expense.category));
    }
  }

  function handleSaveExpense(expense: Expense) {
    const nextExpenses = addExpense(expense);
    learnStoreCategory(expense);
    setExpenses(nextExpenses);
    navigateTo('dashboard');
  }

  function handleUpdateExpense(expense: Expense) {
    const nextExpenses = updateExpense(expense);
    learnStoreCategory(expense);
    setExpenses(nextExpenses);
    setSelectedExpenseId(expense.id);
    navigateTo('detail');
  }

  function handleDeleteExpense(expenseId: string) {
    const nextExpenses = deleteExpense(expenseId);
    setExpenses(nextExpenses);
    setSelectedExpenseId(null);
    navigateTo('list');
  }

  function openExpenseDetail(expenseId: string) {
    setSelectedExpenseId(expenseId);
    navigateTo('detail');
  }

  function handleSaveSchedule(schedule: Schedule) {
    const nextSchedules = addSchedule(schedule);
    setSchedules(nextSchedules);
    setSelectedScheduleId(schedule.id);
    navigateTo('scheduleDetail');
  }

  function handleUpdateSchedule(schedule: Schedule) {
    const nextSchedules = updateSchedule(schedule);
    setSchedules(nextSchedules);
    setSelectedScheduleId(schedule.id);
    navigateTo('scheduleDetail');
  }

  function handleDeleteSchedule(scheduleId: string) {
    const nextSchedules = deleteSchedule(scheduleId);
    setSchedules(nextSchedules);
    setSelectedScheduleId(null);
    navigateTo('schedule');
  }

  function openScheduleAdd(date: string) {
    setScheduleFormDate(date);
    navigateTo('scheduleAdd');
  }

  function openScheduleDetail(scheduleId: string) {
    setSelectedScheduleId(scheduleId);
    navigateTo('scheduleDetail');
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
    dashboard: <Dashboard expenses={expenses} onAdd={() => navigateTo('add')} />,
    add: <AddExpense onCancel={safeBack} onSave={handleSaveExpense} />,
    list: <ExpenseList expenses={expenses} onSelectExpense={openExpenseDetail} />,
    detail: selectedExpense ? (
      <ExpenseDetail
        expense={selectedExpense}
        onBack={safeBack}
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
        onCancel={safeBack}
        onSave={handleSaveSchedule}
      />
    ),
    scheduleDetail: selectedSchedule ? (
      <ScheduleDetail
        schedule={selectedSchedule}
        onBack={safeBack}
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
        onBack={safeBack}
        onDelete={handleDeleteMemory}
        onUpdate={handleUpdateMemory}
      />
    ),
    stats: <Stats expenses={expenses} />,
    settings: <Settings onOpenStoreMemory={() => navigateTo('storeMemory')} />,
  }[page];

  const showBottomNav =
    page === 'dashboard' || page === 'list' || page === 'schedule' || page === 'stats' || page === 'settings';

  return (
    <div className="app-shell text-gray-950">
      <main className="app-frame shadow-2xl ring-1 ring-black/5 sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-[2.5rem]">
        <div className="app-header flex items-center justify-between px-6 pb-3">
          <p className="text-sm font-bold text-gray-950">{t.appName}</p>
          <div className="h-1.5 w-16 rounded-full bg-gray-200" />
        </div>

        <div className={`app-content px-5 pt-2 ${showBottomNav ? 'app-content-with-nav' : 'app-content-no-nav'}`}>
          {pageContent}
        </div>
      </main>

      {showBottomNav ? (
        <>
          <div className="fixed bottom-[calc(68px+env(safe-area-inset-bottom))] left-0 right-0 z-40 mx-auto w-full max-w-[430px]">
            <InstallPrompt />
          </div>
          <BottomNav currentPage={page} onNavigate={navigateTo} />
        </>
      ) : null}
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
