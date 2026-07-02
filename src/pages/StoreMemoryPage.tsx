import { categoryKeys } from '../i18n/translations';
import { useLanguage } from '../context/LanguageContext';
import type { StoreCategoryMemory } from '../types/storeMemory';
import type { ExpenseCategory } from '../types';

type StoreMemoryPageProps = {
  memories: StoreCategoryMemory[];
  onBack: () => void;
  onDelete: (memoryId: string) => void;
  onUpdate: (memoryId: string, category: ExpenseCategory) => void;
};

export function StoreMemoryPage({ memories, onBack, onDelete, onUpdate }: StoreMemoryPageProps) {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <button className="rounded-full px-3 py-2 text-sm font-semibold text-gray-500" type="button" onClick={onBack}>
          {t.detail.back}
        </button>
        <h1 className="text-xl font-bold text-gray-950">{t.storeMemory.title}</h1>
        <span className="w-12" />
      </header>

      {memories.length > 0 ? (
        <div className="space-y-3">
          {memories.map((memory) => (
            <article key={memory.id} className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-gray-950">{memory.storeName}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {t.storeMemory.useCount}: {memory.useCount} · {t.storeMemory.lastUsedAt}:{' '}
                    {new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'ja-JP').format(new Date(memory.lastUsedAt))}
                  </p>
                </div>
                <button
                  className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600"
                  type="button"
                  onClick={() => onDelete(memory.id)}
                >
                  {t.storeMemory.delete}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {categoryKeys.map((category) => (
                  <button
                    key={category}
                    className={`rounded-2xl px-2 py-2 text-sm font-semibold ${
                      memory.category === category ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                    type="button"
                    onClick={() => onUpdate(memory.id, category)}
                  >
                    {t.categories[category]}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-3xl bg-white p-5 text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
          {t.storeMemory.empty}
        </p>
      )}
    </div>
  );
}
