import { useLanguage } from '../context/LanguageContext';

type SettingsProps = {
  onOpenStoreMemory: () => void;
};

export function Settings({ onOpenStoreMemory }: SettingsProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-gray-950">{t.settings.title}</h1>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <p className="text-sm font-semibold text-gray-600">{t.settings.language}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            className={`rounded-2xl px-4 py-3 font-bold ${
              language === 'zh' ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            type="button"
            onClick={() => setLanguage('zh')}
          >
            {t.settings.chinese}
          </button>
          <button
            className={`rounded-2xl px-4 py-3 font-bold ${
              language === 'ja' ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-700'
            }`}
            type="button"
            onClick={() => setLanguage('ja')}
          >
            {t.settings.japanese}
          </button>
        </div>
      </section>

      <button
        className="w-full rounded-[2rem] bg-white p-5 text-left text-base font-bold text-gray-950 shadow-sm ring-1 ring-gray-100"
        type="button"
        onClick={onOpenStoreMemory}
      >
        {t.storeMemory.entry}
      </button>

      <p className="rounded-3xl bg-white p-5 text-sm leading-6 text-gray-500 shadow-sm ring-1 ring-gray-100">
        {t.settings.storageNote}
      </p>
    </div>
  );
}
