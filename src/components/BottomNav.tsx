import type { Page } from '../types';
import { useLanguage } from '../context/LanguageContext';

type NavPage = Extract<Page, 'dashboard' | 'list' | 'schedule' | 'stats' | 'settings'>;

const navPages: NavPage[] = ['dashboard', 'list', 'schedule', 'stats', 'settings'];

type BottomNavProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
};

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const { t } = useLanguage();

  return (
    <nav className="border-t border-gray-200 bg-white/95 px-2 pb-3 pt-2 backdrop-blur">
      <div className="grid grid-cols-5 gap-1">
        {navPages.map((page) => {
          const isActive = currentPage === page;
          return (
            <button
              key={page}
              className={`min-w-0 whitespace-nowrap rounded-2xl px-1 py-2 text-center text-xs font-medium leading-none transition ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
              type="button"
              onClick={() => onNavigate(page)}
            >
              {t.nav[page]}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
