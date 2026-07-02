import type { ExpenseCategory } from '../types';

export type StoreCategoryMemory = {
  id: string;
  storeName: string;
  normalizedStoreName: string;
  category: ExpenseCategory;
  useCount: number;
  lastUsedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type CategorySuggestionReason = 'memory' | 'store-keyword' | 'item-keyword' | 'fallback';

export type CategorySuggestion = {
  category: ExpenseCategory;
  reason: CategorySuggestionReason;
};
