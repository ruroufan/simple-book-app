import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translations } from '../i18n/translations';
import type { Language } from '../types';
import { writeLatestBackup } from '../services/backup';
import { removePersistentData, setPersistentData } from '../services/persistentStorage';

const LANGUAGE_KEY = 'simplebook_language';
const LEGACY_LANGUAGE_KEY = 'minimal-expense-language';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  resetLanguagePreference: () => void;
  t: (typeof translations)[Language];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh' : 'ja';
  }, [language]);

  function setLanguage(language: Language) {
    localStorage.setItem(LANGUAGE_KEY, language);
    localStorage.setItem(LEGACY_LANGUAGE_KEY, language);
    void setPersistentData('language', language);
    writeLatestBackup();
    setLanguageState(language);
  }

  function resetLanguagePreference() {
    const nextLanguage = detectBrowserLanguage();
    localStorage.removeItem(LANGUAGE_KEY);
    localStorage.removeItem(LEGACY_LANGUAGE_KEY);
    void removePersistentData('language');
    setLanguageState(nextLanguage);
  }

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      resetLanguagePreference,
      t: translations[language],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return value;
}

export function getInitialLanguage(): Language {
  const savedLanguage = getSavedLanguage();
  return savedLanguage ?? detectBrowserLanguage();
}

export function detectBrowserLanguage(): Language {
  const browserLanguages =
    typeof navigator !== 'undefined' && navigator.languages?.length
      ? navigator.languages
      : [typeof navigator !== 'undefined' ? navigator.language : ''];

  const supportedLanguage = browserLanguages
    .map((language) => language.toLowerCase())
    .find((language) => language.startsWith('ja') || language.startsWith('zh'));

  if (supportedLanguage?.startsWith('ja')) {
    return 'ja';
  }

  return 'zh';
}

function getSavedLanguage(): Language | null {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY) ?? localStorage.getItem(LEGACY_LANGUAGE_KEY);
  return savedLanguage === 'zh' || savedLanguage === 'ja' ? savedLanguage : null;
}
