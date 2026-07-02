const DB_NAME = 'simplebook-db';
const STORE_NAME = 'keyValue';
const DB_VERSION = 1;
const MIGRATION_KEY = 'storage_migrated_v1';

type PersistentKey = 'expenses' | 'schedules' | 'storeMemories' | 'language' | 'latestBackup';

const legacyKeys: Record<Exclude<PersistentKey, 'latestBackup'>, string> = {
  expenses: 'minimal-expense-records',
  schedules: 'minimal-expense-schedules',
  storeMemories: 'minimal-expense-store-category-memory',
  language: 'simplebook_language',
};

const fallbackLanguageKey = 'minimal-expense-language';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getPersistentData<T>(key: PersistentKey): Promise<T | null> {
  if (!('indexedDB' in window)) {
    return null;
  }

  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(key);

    request.onsuccess = () => resolve((request.result as T | undefined) ?? null);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
  });
}

export async function setPersistentData<T>(key: PersistentKey, value: T): Promise<void> {
  if (!('indexedDB' in window)) {
    return;
  }

  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const request = transaction.objectStore(STORE_NAME).put(value, key);

    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

export async function removePersistentData(key: PersistentKey): Promise<void> {
  if (!('indexedDB' in window)) {
    return;
  }

  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const request = transaction.objectStore(STORE_NAME).delete(key);

    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => {
      db.close();
      resolve();
    };
  });
}

export async function initializePersistentStorage(): Promise<void> {
  if (!('indexedDB' in window)) {
    return;
  }

  await hydrateLocalStorageFromIndexedDB();

  if (localStorage.getItem(MIGRATION_KEY) === 'true') {
    return;
  }

  await Promise.all(
    Object.entries(legacyKeys).map(async ([persistentKey, localStorageKey]) => {
      const raw =
        persistentKey === 'language'
          ? localStorage.getItem(localStorageKey) ?? localStorage.getItem(fallbackLanguageKey)
          : localStorage.getItem(localStorageKey);
      if (!raw) {
        return;
      }

      const value = persistentKey === 'language' ? raw : safelyParse(raw);
      if (value !== null) {
        await setPersistentData(persistentKey as PersistentKey, value);
      }
    }),
  );

  localStorage.setItem(MIGRATION_KEY, 'true');
}

async function hydrateLocalStorageFromIndexedDB() {
  await Promise.all(
    Object.entries(legacyKeys).map(async ([persistentKey, localStorageKey]) => {
      if (localStorage.getItem(localStorageKey)) {
        return;
      }

      const value = await getPersistentData<unknown>(persistentKey as PersistentKey);
      if (value === null) {
        return;
      }

      localStorage.setItem(localStorageKey, typeof value === 'string' ? value : JSON.stringify(value));
    }),
  );
}

function safelyParse(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
