import type { Expense, Language } from '../types';
import type { Schedule } from '../types/schedule';
import type { StoreCategoryMemory } from '../types/storeMemory';
import { setPersistentData } from './persistentStorage';

export const APP_VERSION = '0.1.0';
export const BACKUP_KEY = 'simplebook_backup_latest';
export const LOCAL_UPDATED_AT_KEY = 'simplebook_local_updated_at';

const EXPENSES_KEY = 'minimal-expense-records';
const SCHEDULES_KEY = 'minimal-expense-schedules';
const STORE_MEMORY_KEY = 'minimal-expense-store-category-memory';
const LANGUAGE_KEY = 'simplebook_language';
const LEGACY_LANGUAGE_KEY = 'minimal-expense-language';

export type BackupData = {
  version: string;
  appVersion: string;
  exportedAt: string;
  updatedAt: string;
  expenses: Expense[];
  schedules: Schedule[];
  storeMemories: StoreCategoryMemory[];
  settings: {
    language: Language;
  };
};

export function createBackupData({
  includeReceiptImages = true,
  updatedAt,
}: { includeReceiptImages?: boolean; updatedAt?: string } = {}): BackupData {
  const expenses = readJson<Expense[]>(EXPENSES_KEY, []);

  return {
    version: '1',
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    updatedAt: updatedAt ?? getLocalUpdatedAt() ?? getNewestLocalRecordTime(expenses),
    expenses: includeReceiptImages ? expenses : expenses.map(removeReceiptImage),
    schedules: readJson<Schedule[]>(SCHEDULES_KEY, []),
    storeMemories: readJson<StoreCategoryMemory[]>(STORE_MEMORY_KEY, []),
    settings: {
      language: getStoredLanguage(),
    },
  };
}

export function writeLatestBackup() {
  const updatedAt = new Date().toISOString();
  localStorage.setItem(LOCAL_UPDATED_AT_KEY, updatedAt);
  const backup = createBackupData({ includeReceiptImages: false, updatedAt });
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
  } catch {
    localStorage.removeItem(BACKUP_KEY);
  }
  void setPersistentData('latestBackup', backup).catch(() => undefined);
}

export function getLatestBackup(): BackupData | null {
  const raw = localStorage.getItem(BACKUP_KEY);
  if (raw) {
    return parseBackup(raw);
  }
  return null;
}

export function downloadBackup() {
  const backup = createBackupData();
  const fileName = `simplebook-backup-${backup.exportedAt.slice(0, 10)}.json`;
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export async function readBackupFile(file: File): Promise<BackupData> {
  const text = await file.text();
  const backup = parseBackup(text);
  if (!backup) {
    throw new Error('Invalid backup file');
  }
  return backup;
}

export function restoreBackup(backup: BackupData) {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(backup.expenses));
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(backup.schedules));
  localStorage.setItem(STORE_MEMORY_KEY, JSON.stringify(backup.storeMemories));
  localStorage.setItem(LANGUAGE_KEY, backup.settings.language);
  localStorage.setItem(LEGACY_LANGUAGE_KEY, backup.settings.language);
  localStorage.setItem(LOCAL_UPDATED_AT_KEY, backup.updatedAt);
  try {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
  } catch {
    localStorage.removeItem(BACKUP_KEY);
  }

  void setPersistentData('expenses', backup.expenses).catch(() => undefined);
  void setPersistentData('schedules', backup.schedules).catch(() => undefined);
  void setPersistentData('storeMemories', backup.storeMemories).catch(() => undefined);
  void setPersistentData('language', backup.settings.language).catch(() => undefined);
  void setPersistentData('latestBackup', backup).catch(() => undefined);
}

export function getLocalUpdatedAt() {
  return localStorage.getItem(LOCAL_UPDATED_AT_KEY);
}

function removeReceiptImage(expense: Expense): Expense {
  const { receiptImageUrl, ...rest } = expense;
  return rest;
}

function getStoredLanguage(): Language {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY) ?? localStorage.getItem(LEGACY_LANGUAGE_KEY);
  return savedLanguage === 'ja' ? 'ja' : 'zh';
}

function parseBackup(raw: string): BackupData | null {
  try {
    const value = JSON.parse(raw) as Partial<BackupData>;
    if (!Array.isArray(value.expenses) || !Array.isArray(value.schedules) || !Array.isArray(value.storeMemories)) {
      return null;
    }

    return {
      version: value.version ?? '1',
      appVersion: value.appVersion ?? APP_VERSION,
      exportedAt: value.exportedAt ?? new Date().toISOString(),
      updatedAt: value.updatedAt ?? value.exportedAt ?? new Date().toISOString(),
      expenses: value.expenses as Expense[],
      schedules: value.schedules as Schedule[],
      storeMemories: value.storeMemories as StoreCategoryMemory[],
      settings: {
        language: value.settings?.language === 'ja' ? 'ja' : 'zh',
      },
    };
  } catch {
    return null;
  }
}

function getNewestLocalRecordTime(expenses: Expense[]) {
  const schedules = readJson<Schedule[]>(SCHEDULES_KEY, []);
  const memories = readJson<StoreCategoryMemory[]>(STORE_MEMORY_KEY, []);
  const timestamps = [
    ...expenses.map((expense) => expense.updatedAt ?? expense.createdAt),
    ...schedules.map((schedule) => schedule.updatedAt ?? schedule.createdAt),
    ...memories.map((memory) => memory.updatedAt ?? memory.createdAt),
  ].filter(Boolean);

  const sortedTimestamps = timestamps.sort();
  return sortedTimestamps[sortedTimestamps.length - 1] ?? new Date().toISOString();
}

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
