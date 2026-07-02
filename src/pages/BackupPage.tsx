import { useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { downloadBackup, getLatestBackup, readBackupFile, restoreBackup } from '../services/backup';

type BackupPageProps = {
  onBack: () => void;
  onRestored: () => void;
};

export function BackupPage({ onBack, onRestored }: BackupPageProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>('');
  const hasLocalBackup = Boolean(getLatestBackup());

  function handleExport() {
    downloadBackup();
    setStatus(t.backup.exported);
  }

  async function handleImport(file: File | undefined) {
    if (!file) {
      return;
    }

    if (!window.confirm(t.backup.importConfirm)) {
      return;
    }

    try {
      const backup = await readBackupFile(file);
      restoreBackup(backup);
      setStatus(t.backup.restored);
      onRestored();
    } catch {
      setStatus(t.backup.invalidFile);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function handleRestoreLocal() {
    const backup = getLatestBackup();
    if (!backup || !window.confirm(t.backup.importConfirm)) {
      return;
    }

    restoreBackup(backup);
    setStatus(t.backup.restored);
    onRestored();
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <button className="rounded-full px-3 py-2 text-sm font-semibold text-gray-500" type="button" onClick={onBack}>
          {t.detail.back}
        </button>
        <h1 className="text-xl font-bold text-gray-950">{t.backup.title}</h1>
        <span className="w-12" />
      </header>

      <section className="space-y-3 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <p className="text-sm font-bold text-gray-700">{t.backup.sectionTitle}</p>
        <button
          className="w-full rounded-2xl bg-gray-950 px-4 py-3 text-sm font-bold text-white"
          type="button"
          onClick={handleExport}
        >
          {t.backup.exportData}
        </button>
        <button
          className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-800"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          {t.backup.importData}
        </button>
        <input
          ref={fileInputRef}
          className="hidden"
          accept="application/json"
          type="file"
          onChange={(event) => void handleImport(event.target.files?.[0])}
        />
        <button
          className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-800 disabled:text-gray-400"
          disabled={!hasLocalBackup}
          type="button"
          onClick={handleRestoreLocal}
        >
          {hasLocalBackup ? t.backup.restoreLocal : t.backup.noLocalBackup}
        </button>
      </section>

      {status ? <p className="rounded-2xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white">{status}</p> : null}

      <p className="rounded-3xl bg-white p-5 text-sm leading-6 text-gray-500 shadow-sm ring-1 ring-gray-100">
        {t.backup.note}
      </p>
    </div>
  );
}
