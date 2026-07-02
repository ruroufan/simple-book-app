import type { Expense, Language } from '../types';
import type { Schedule } from '../types/schedule';
import type { StoreCategoryMemory } from '../types/storeMemory';
import { setPersistentData } from './persistentStorage';

export const APP_VERSION = '0.1.0';
export const BACKUP_KEY = 'simplebook_backup_latest';

const EXPENSES_KEY = 'minimal-expense-records';
const SCHEDULES_KEY = 'minimal-expense-schedules';
const STORE_MEMORY_KEY = 'minimal-expense-store-category-memory';
const LANGUAGE_KEY = 'simplebook_language';
const LEGACY_LANGUAGE_KEY = 'minimal-expense-language';

export type BackupData = {
  version: string;
  appVersion: string;
  exportedAt: string;
  expenses: Expense[];
  schedules: Schedule[];
  storeMemories: StoreCategoryMemory[];
  settings: {
    language: Language;
  };
};

export function createBackupData(): BackupData {
  return {
    version: '1',
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    expenses: readJson<Expense[]>(EXPENSES_KEY, []),
    schedules: readJson<Schedule[]>(SCHEDULES_KEY, []),
    storeMemories: readJson<StoreCategoryMemory[]>(STORE_MEMORY_KEY, []),
    settings: {
      language: getStoredLanguage(),
    },
  };
}

export function writeLatestBackup() {
  const backup = createBackupData();
  localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
  void setPersistentData('latestBackup', backup);
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
  localStorage.setItem(BACKUP_KEY, JSON.stringify(backup));

  void setPersistentData('expenses', backup.expenses);
  void setPersistentData('schedules', backup.schedules);
  void setPersistentData('storeMemories', backup.storeMemories);
  void setPersistentData('language', backup.settings.language);
  void setPersistentData('latestBackup', backup);
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
