import { describe, expect, it } from 'vitest';
import type { StoreCategoryMemory } from '../types/storeMemory';
import { normalizeStoreName, rememberStoreCategory, suggestCategory } from './storeCategoryMemory';

describe('store category memory', () => {
  it('normalizes common store aliases to the same key', () => {
    expect(normalizeStoreName('FamilyMart')).toBe(normalizeStoreName('family mart'));
    expect(normalizeStoreName('FamilyMart')).toBe(normalizeStoreName('ファミリーマート'));
    expect(normalizeStoreName('7-Eleven')).toBe(normalizeStoreName('セブンイレブン'));
    expect(normalizeStoreName('Lawson')).toBe(normalizeStoreName('ローソン'));
  });

  it('updates existing memory use count and category', () => {
    const existing: StoreCategoryMemory[] = [
      {
        id: 'memory-1',
        storeName: 'FamilyMart',
        normalizedStoreName: normalizeStoreName('FamilyMart'),
        category: 'other',
        useCount: 1,
        createdAt: '2026-07-01T00:00:00.000Z',
        updatedAt: '2026-07-01T00:00:00.000Z',
        lastUsedAt: '2026-07-01T00:00:00.000Z',
      },
    ];

    const next = rememberStoreCategory(existing, 'ファミリーマート', 'food', '2026-07-02T00:00:00.000Z');

    expect(next).toHaveLength(1);
    expect(next[0].category).toBe('food');
    expect(next[0].useCount).toBe(2);
    expect(next[0].lastUsedAt).toBe('2026-07-02T00:00:00.000Z');
  });

  it('prioritizes memory before store and item keywords', () => {
    const memory: StoreCategoryMemory[] = [
      {
        id: 'memory-1',
        storeName: 'FamilyMart',
        normalizedStoreName: normalizeStoreName('FamilyMart'),
        category: 'daily',
        useCount: 3,
        createdAt: '2026-07-01T00:00:00.000Z',
        updatedAt: '2026-07-01T00:00:00.000Z',
        lastUsedAt: '2026-07-01T00:00:00.000Z',
      },
    ];

    expect(suggestCategory({ storeName: 'family mart', detectedText: '弁当 コーヒー', userMemoryList: memory })).toEqual({
      category: 'daily',
      reason: 'memory',
    });
    expect(suggestCategory({ storeName: 'UNIQLO', detectedText: '', userMemoryList: [] })).toEqual({
      category: 'clothing',
      reason: 'store-keyword',
    });
    expect(suggestCategory({ storeName: '', detectedText: '電車 バス', userMemoryList: [] })).toEqual({
      category: 'transport',
      reason: 'item-keyword',
    });
  });
});
