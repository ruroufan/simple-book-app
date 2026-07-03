import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  checkCloudData,
  getRecoveryCode,
  restoreFromCloud,
  subscribeCloudSync,
  syncToCloud,
} from '../services/cloudSync';
import type { CloudSyncState, CloudSyncStatus } from '../types/cloudSync';

type CloudSyncSectionProps = {
  onRestored: () => void;
};

export function CloudSyncSection({ onRestored }: CloudSyncSectionProps) {
  const { language, t } = useLanguage();
  const [syncState, setSyncState] = useState<CloudSyncState>(() => ({
    status: 'pending',
    recoveryCode: getRecoveryCode(),
  }));
  const [restoreCode, setRestoreCode] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeCloudSync(setSyncState);
    return () => {
      unsubscribe();
    };
  }, []);

  async function handleCopyCode() {
    const code = syncState.recoveryCode ?? getRecoveryCode();
    await navigator.clipboard.writeText(code);
    setMessage(t.cloudSync.copied);
  }

  async function handleSyncNow() {
    setMessage('');
    await syncToCloud().catch(() => undefined);
  }

  async function handleRestore() {
    setMessage('');
    const row = await checkCloudData(restoreCode).catch(() => null);
    if (!row) {
      setMessage(t.cloudSync.restoreNotFound);
      return;
    }

    if (!window.confirm(t.cloudSync.restoreConfirm)) {
      return;
    }

    const restored = await restoreFromCloud(restoreCode).catch(() => false);
    if (restored) {
      setRestoreCode('');
      setMessage(t.cloudSync.restoreSuccess);
      onRestored();
      return;
    }

    setMessage(t.cloudSync.restoreFailed);
  }

  return (
    <section className="space-y-4 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-950">{t.cloudSync.title}</h2>
          <p className="mt-1 text-sm text-gray-500">{t.cloudSync.status}: {statusLabel(syncState.status, t)}</p>
        </div>
        <span className={`mt-1 h-3 w-3 rounded-full ${statusDotClass(syncState.status)}`} />
      </div>

      <div className="rounded-2xl bg-gray-100 px-4 py-3">
        <p className="text-xs font-semibold text-gray-500">{t.cloudSync.lastSyncedAt}</p>
        <p className="mt-1 text-sm font-bold text-gray-800">
          {syncState.lastSyncedAt
            ? new Intl.DateTimeFormat(language === 'zh' ? 'zh-CN' : 'ja-JP', {
                dateStyle: 'short',
                timeStyle: 'short',
              }).format(new Date(syncState.lastSyncedAt))
            : '-'}
        </p>
      </div>

      <div className="rounded-2xl bg-gray-100 px-4 py-3">
        <p className="text-xs font-semibold text-gray-500">{t.cloudSync.recoveryCode}</p>
        <p className="mt-1 select-all text-lg font-black tracking-wide text-gray-950">
          {syncState.recoveryCode ?? getRecoveryCode()}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          className="rounded-2xl bg-gray-100 px-3 py-3 text-sm font-bold text-gray-800"
          type="button"
          onClick={handleCopyCode}
        >
          {t.cloudSync.copyRecoveryCode}
        </button>
        <button
          className="rounded-2xl bg-gray-950 px-3 py-3 text-sm font-bold text-white disabled:opacity-50"
          disabled={syncState.status === 'syncing' || syncState.status === 'disabled'}
          type="button"
          onClick={() => void handleSyncNow()}
        >
          {t.cloudSync.syncNow}
        </button>
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-4">
        <p className="text-sm font-bold text-gray-700">{t.cloudSync.restoreByCode}</p>
        <input
          className="w-full rounded-2xl bg-gray-100 px-4 py-3 text-base font-semibold uppercase text-gray-950 outline-none"
          placeholder={t.cloudSync.codePlaceholder}
          value={restoreCode}
          onChange={(event) => setRestoreCode(event.target.value.toUpperCase())}
        />
        <button
          className="w-full rounded-2xl bg-gray-100 px-3 py-3 text-sm font-bold text-gray-800 disabled:text-gray-400"
          disabled={!restoreCode.trim()}
          type="button"
          onClick={() => void handleRestore()}
        >
          {t.cloudSync.restoreByCode}
        </button>
      </div>

      {syncState.status === 'disabled' ? <p className="text-xs leading-5 text-gray-500">{t.cloudSync.envNote}</p> : null}
      {message ? <p className="rounded-2xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white">{message}</p> : null}
    </section>
  );
}

function statusLabel(status: CloudSyncStatus, t: ReturnType<typeof useLanguage>['t']) {
  const labels = {
    disabled: t.cloudSync.disabled,
    synced: t.cloudSync.synced,
    syncing: t.cloudSync.syncing,
    pending: t.cloudSync.pending,
    failed: t.cloudSync.failed,
  };
  return labels[status];
}

function statusDotClass(status: CloudSyncStatus) {
  if (status === 'synced') {
    return 'bg-green-500';
  }
  if (status === 'syncing') {
    return 'bg-blue-500';
  }
  if (status === 'pending') {
    return 'bg-amber-500';
  }
  if (status === 'failed') {
    return 'bg-red-500';
  }
  return 'bg-gray-300';
}
