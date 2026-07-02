import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectBrowserLanguage, getInitialLanguage } from './LanguageContext';

function stubNavigator(languages: string[], language = languages[0] ?? '') {
  vi.stubGlobal('navigator', { languages, language });
}

function stubLocalStorage(values: Record<string, string> = {}) {
  const store = new Map(Object.entries(values));
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  });
}

describe('language initialization', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uses Japanese when navigator.languages starts with ja', () => {
    stubNavigator(['ja-JP', 'en-US']);

    expect(detectBrowserLanguage()).toBe('ja');
  });

  it('uses Chinese when navigator.languages starts with zh', () => {
    stubNavigator(['zh-TW', 'en-US']);

    expect(detectBrowserLanguage()).toBe('zh');
  });

  it('falls back to Chinese for unsupported languages', () => {
    stubNavigator(['en-US']);

    expect(detectBrowserLanguage()).toBe('zh');
  });

  it('uses saved manual language before browser language', () => {
    stubNavigator(['ja-JP']);
    stubLocalStorage({ simplebook_language: 'zh' });

    expect(getInitialLanguage()).toBe('zh');
  });
});
