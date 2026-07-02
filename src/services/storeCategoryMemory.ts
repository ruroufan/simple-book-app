import type { ExpenseCategory } from '../types';
import type { CategorySuggestion, StoreCategoryMemory } from '../types/storeMemory';
import { writeLatestBackup } from './backup';
import { setPersistentData } from './persistentStorage';

const STORE_MEMORY_KEY = 'minimal-expense-store-category-memory';

const storeKeywordRules: Array<{ category: ExpenseCategory; keywords: string[] }> = [
  {
    category: 'food',
    keywords: [
      'コンビニ',
      'familymart',
      'ファミリーマート',
      'lawson',
      'ローソン',
      'セブン',
      '7eleven',
      'イオン',
      'ライフ',
      '業務スーパー',
    ],
  },
  { category: 'clothing', keywords: ['uniqlo', 'gu'] },
  { category: 'transport', keywords: ['jr', '電車', 'バス', 'タクシー'] },
  { category: 'daily', keywords: ['スギ薬局', 'マツモトキヨシ', 'ドラッグストア', '薬局', 'amazon', '楽天'] },
];

const itemKeywordRules: Array<{ category: ExpenseCategory; keywords: string[] }> = [
  { category: 'food', keywords: ['食品', '弁当', 'パン', 'コーヒー', 'スーパー'] },
  { category: 'clothing', keywords: ['服', '衣類', '靴'] },
  { category: 'transport', keywords: ['電車', 'バス', 'タクシー', '交通', 'ガソリン'] },
  { category: 'daily', keywords: ['薬', '洗剤', '日用品', 'ティッシュ', 'シャンプー'] },
];

export function getStoreCategoryMemories(): StoreCategoryMemory[] {
  const raw = localStorage.getItem(STORE_MEMORY_KEY);
  if (!raw) {
    return [];
  }

  try {
    const memories = JSON.parse(raw) as Partial<StoreCategoryMemory>[];
    return Array.isArray(memories) ? memories.map(normalizeMemoryRecord).filter(isStoreMemory) : [];
  } catch {
    return [];
  }
}

export function saveStoreCategoryMemories(memories: StoreCategoryMemory[]) {
  localStorage.setItem(STORE_MEMORY_KEY, JSON.stringify(memories));
  void setPersistentData('storeMemories', memories);
  writeLatestBackup();
}

export function upsertStoreCategoryMemory(storeName: string | undefined, category: ExpenseCategory) {
  if (!storeName?.trim()) {
    return getStoreCategoryMemories();
  }

  const next = rememberStoreCategory(getStoreCategoryMemories(), storeName, category, new Date().toISOString());
  saveStoreCategoryMemories(next);
  return next;
}

export function updateStoreCategoryMemory(memoryId: string, category: ExpenseCategory) {
  const now = new Date().toISOString();
  const next = getStoreCategoryMemories().map((memory) =>
    memory.id === memoryId ? { ...memory, category, updatedAt: now, lastUsedAt: now } : memory,
  );
  saveStoreCategoryMemories(next);
  return next;
}

export function deleteStoreCategoryMemory(memoryId: string) {
  const next = getStoreCategoryMemories().filter((memory) => memory.id !== memoryId);
  saveStoreCategoryMemories(next);
  return next;
}

export function rememberStoreCategory(
  memories: StoreCategoryMemory[],
  storeName: string,
  category: ExpenseCategory,
  now: string,
) {
  const normalizedStoreName = normalizeStoreName(storeName);
  if (!normalizedStoreName) {
    return memories;
  }

  const existing = memories.find((memory) => memory.normalizedStoreName === normalizedStoreName);
  if (existing) {
    return memories.map((memory) =>
      memory.id === existing.id
        ? {
            ...memory,
            storeName: storeName.trim(),
            category,
            useCount: memory.useCount + 1,
            lastUsedAt: now,
            updatedAt: now,
          }
        : memory,
    );
  }

  return [
    {
      id: crypto.randomUUID(),
      storeName: storeName.trim(),
      normalizedStoreName,
      category,
      useCount: 1,
      lastUsedAt: now,
      createdAt: now,
      updatedAt: now,
    },
    ...memories,
  ];
}

export function getSuggestedCategoryByMemory(storeName: string | undefined, memories = getStoreCategoryMemories()) {
  if (!storeName) {
    return undefined;
  }

  const normalizedStoreName = normalizeStoreName(storeName);
  return memories.find((memory) => memory.normalizedStoreName === normalizedStoreName)?.category;
}

export function suggestCategory({
  storeName,
  detectedText,
  userMemoryList,
}: {
  storeName?: string;
  detectedText?: string;
  userMemoryList: StoreCategoryMemory[];
}): CategorySuggestion {
  const memoryCategory = getSuggestedCategoryByMemory(storeName, userMemoryList);
  if (memoryCategory) {
    return { category: memoryCategory, reason: 'memory' };
  }

  const storeCategory = findCategoryByKeywords(storeName ?? '', storeKeywordRules);
  if (storeCategory) {
    return { category: storeCategory, reason: 'store-keyword' };
  }

  const textCategory = findCategoryByKeywords(detectedText ?? '', itemKeywordRules);
  if (textCategory) {
    return { category: textCategory, reason: 'item-keyword' };
  }

  return { category: 'other', reason: 'fallback' };
}

export function normalizeStoreName(storeName: string) {
  const normalized = storeName
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s\-_.・／/\\|｜,，.。()（）［\][\]【】]/g, '');

  if (/^(familymart|famima|ファミリーマート|ファミマ)$/.test(normalized)) {
    return 'familymart';
  }
  if (/^(lawson|ローソン)$/.test(normalized)) {
    return 'lawson';
  }
  if (/^(7eleven|seveneleven|セブン|セブンイレブン)$/.test(normalized)) {
    return '7eleven';
  }
  return normalized;
}

function findCategoryByKeywords(text: string, rules: Array<{ category: ExpenseCategory; keywords: string[] }>) {
  const normalizedText = normalizeStoreName(text);
  const rawText = text.normalize('NFKC').toLowerCase();

  return rules.find((rule) =>
    rule.keywords.some((keyword) => {
      const normalizedKeyword = normalizeStoreName(keyword);
      return normalizedText.includes(normalizedKeyword) || rawText.includes(keyword.normalize('NFKC').toLowerCase());
    }),
  )?.category;
}

function normalizeMemoryRecord(memory: Partial<StoreCategoryMemory>): StoreCategoryMemory | null {
  if (!memory.id || !memory.storeName || !memory.category) {
    return null;
  }

  const createdAt = memory.createdAt ?? new Date().toISOString();
  return {
    id: memory.id,
    storeName: memory.storeName,
    normalizedStoreName: memory.normalizedStoreName ?? normalizeStoreName(memory.storeName),
    category: memory.category,
    useCount: memory.useCount ?? 1,
    lastUsedAt: memory.lastUsedAt ?? createdAt,
    createdAt,
    updatedAt: memory.updatedAt ?? createdAt,
  };
}

function isStoreMemory(memory: StoreCategoryMemory | null): memory is StoreCategoryMemory {
  return memory !== null;
}
