import { describe, expect, it } from 'vitest';
import { extractReceiptFields } from './receiptRecognition';
import { suggestCategory } from './storeCategoryMemory';

describe('receipt text parsing', () => {
  it('prefers the amount next to 合計 and recognizes Japanese convenience store receipts', () => {
    const result = extractReceiptFields(`
      ファミリーマート
      2026/07/01 18:30
      お弁当 580
      コーヒー 120
      税込 700
      合計 ￥1,280
    `);

    expect(result.amount).toBe(1280);
    expect(result.date).toBe('2026-07-01');
    expect(result.storeName).toBe('FamilyMart');
    expect(result.suggestedCategory).toBe('food');
    expect(result.keywords).toContain('弁当');
  });

  it('falls back to お買上げ金額 before 税込 and normalizes short dates', () => {
    const result = extractReceiptFields(`
      ローソン
      26/7/1
      税込 300
      お買上げ金額 1,480
    `);

    expect(result.amount).toBe(1480);
    expect(result.date).toBe('2026-07-01');
    expect(result.storeName).toBe('Lawson');
    expect(result.suggestedCategory).toBe('food');
  });

  it('uses the last larger amount and supports month-day dates without a year', () => {
    const result = extractReceiptFields(`
      7-Eleven
      7月1日
      小計 240
      税 24
      1280
    `);

    expect(result.amount).toBe(1280);
    expect(result.date).toMatch(/^\d{4}-07-01$/);
    expect(result.storeName).toBe('7-Eleven');
  });

  it('classifies configured Japanese keywords', () => {
    expect(suggestCategory({ detectedText: 'UNIQLO 靴 衣類', userMemoryList: [] }).category).toBe('clothing');
    expect(suggestCategory({ detectedText: '電車 バス 交通', userMemoryList: [] }).category).toBe('transport');
    expect(suggestCategory({ detectedText: 'ドラッグストア 洗剤 ティッシュ', userMemoryList: [] }).category).toBe('daily');
    expect(suggestCategory({ detectedText: '判断できない文字', userMemoryList: [] }).category).toBe('other');
  });
});
