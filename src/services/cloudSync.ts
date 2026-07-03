import {
  createBackupData,
  getLocalUpdatedAt,
  LOCAL_UPDATED_AT_KEY,
  restoreBackup,
  type BackupData,
} from './backup';
import type { CloudDataPayload, CloudProfile, CloudRow, CloudSyncState } from '../types/cloudSync';

const DEVICE_ID_KEY = 'simplebook_device_id';
const RECOVERY_CODE_KEY = 'simplebook_recovery_code';
const CLOUD_PROFILE_KEY = 'simplebook_cloud_profile';
const PENDING_SYNC_KEY = 'simplebook_has_pending_sync';

const tableName = 'simplebook_user_data';
const listeners = new Set<(state: CloudSyncState) => void>();

let syncTimer: number | undefined;
let onlineListenersAttached = false;
let state: CloudSyncState = {
  status: getSupabaseConfig() ? (getStorageItem(PENDING_SYNC_KEY) === 'true' ? 'pending' : 'synced') : 'disabled',
  recoveryCode: getStorageItem(RECOVERY_CODE_KEY) ?? undefined,
  lastSyncedAt: getSavedProfile()?.lastSyncedAt,
};

export function subscribeCloudSync(listener: (state: CloudSyncState) => void) {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

export function getCloudSyncState() {
  return state;
}

export function initDeviceIdentity(): CloudProfile {
  const now = new Date().toISOString();
  const savedProfile = getSavedProfile();
  const deviceId = getStorageItem(DEVICE_ID_KEY) ?? savedProfile?.deviceId ?? createUuid();
  const recoveryCode = getStorageItem(RECOVERY_CODE_KEY) ?? savedProfile?.recoveryCode ?? generateRecoveryCode();

  const profile: CloudProfile = {
    id: savedProfile?.id ?? createUuid(),
    deviceId,
    recoveryCode,
    createdAt: savedProfile?.createdAt ?? now,
    updatedAt: now,
    lastSyncedAt: savedProfile?.lastSyncedAt,
  };

  saveProfile(profile);
  setState({ recoveryCode });
  return profile;
}

export function getDeviceId() {
  return initDeviceIdentity().deviceId;
}

export function getRecoveryCode() {
  return initDeviceIdentity().recoveryCode;
}

export function requestCloudSync() {
  if (!getSupabaseConfig()) {
    setState({ status: 'disabled' });
    return;
  }

  if (!isOnline()) {
    markPending();
    return;
  }

  globalThis.clearTimeout(syncTimer);
  syncTimer = globalThis.setTimeout(() => {
    void syncToCloud().catch(() => markFailed());
  }, 600);
}

export async function autoSync() {
  initDeviceIdentity();
  attachOnlineListeners();

  if (!getSupabaseConfig()) {
    setState({ status: 'disabled' });
    return;
  }

  if (!isOnline()) {
    markPending();
    return;
  }

  await mergeLocalAndCloudData();
}

export async function syncToCloud() {
  const config = getSupabaseConfig();
  if (!config) {
    setState({ status: 'disabled' });
    return;
  }

  if (!isOnline()) {
    markPending();
    return;
  }

  const profile = initDeviceIdentity();
  const data = buildCloudData();
  setState({ status: 'syncing', error: undefined });

  const response = await fetch(`${config.url}/rest/v1/${tableName}?on_conflict=device_id`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      device_id: profile.deviceId,
      recovery_code: profile.recoveryCode,
      data,
      updated_at: data.updatedAt,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const [row] = (await response.json()) as CloudRow[];
  const lastSyncedAt = row?.updated_at ?? new Date().toISOString();
  removeStorageItem(PENDING_SYNC_KEY);
  saveProfile({ ...profile, lastSyncedAt, updatedAt: lastSyncedAt });
  setState({ status: 'synced', lastSyncedAt, recoveryCode: profile.recoveryCode, error: undefined });
}

export async function restoreFromCloud(recoveryCode: string) {
  const normalizedCode = recoveryCode.trim().toUpperCase();
  const row = await fetchCloudDataByRecoveryCode(normalizedCode);
  if (!row) {
    return false;
  }

  restoreCloudRow(row);
  return true;
}

export async function checkCloudData(recoveryCode: string) {
  return fetchCloudDataByRecoveryCode(recoveryCode.trim().toUpperCase());
}

export async function mergeLocalAndCloudData() {
  const profile = initDeviceIdentity();
  const cloudRow = await fetchCloudDataByDeviceId(profile.deviceId);

  if (!cloudRow) {
    await syncToCloud();
    return;
  }

  const localData = buildCloudData();
  const localUpdatedAt = new Date(localData.updatedAt).getTime();
  const cloudUpdatedAt = new Date(cloudRow.data?.updatedAt ?? cloudRow.updated_at).getTime();

  if (isLocalEmpty(localData) && !isLocalEmpty(cloudRow.data)) {
    restoreCloudRow(cloudRow);
    return;
  }

  if (Number.isFinite(cloudUpdatedAt) && cloudUpdatedAt > localUpdatedAt) {
    restoreCloudRow(cloudRow);
    return;
  }

  await syncToCloud();
}

function restoreCloudRow(row: CloudRow) {
  restoreBackup(row.data);
  setStorageItem(DEVICE_ID_KEY, row.device_id);
  setStorageItem(RECOVERY_CODE_KEY, row.recovery_code);
  setStorageItem(LOCAL_UPDATED_AT_KEY, row.data.updatedAt ?? row.updated_at);
  removeStorageItem(PENDING_SYNC_KEY);

  saveProfile({
    id: row.id,
    deviceId: row.device_id,
    recoveryCode: row.recovery_code,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastSyncedAt: row.updated_at,
  });

  setState({
    status: 'synced',
    recoveryCode: row.recovery_code,
    lastSyncedAt: row.updated_at,
    error: undefined,
  });
}

async function fetchCloudDataByDeviceId(deviceId: string) {
  return fetchCloudRows(`device_id=eq.${encodeURIComponent(deviceId)}`);
}

async function fetchCloudDataByRecoveryCode(recoveryCode: string) {
  return fetchCloudRows(`recovery_code=eq.${encodeURIComponent(recoveryCode)}`);
}

async function fetchCloudRows(filter: string) {
  const config = getSupabaseConfig();
  if (!config) {
    setState({ status: 'disabled' });
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${tableName}?${filter}&select=*&limit=1`, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
    },
  });

  if (!response.ok) {
    markFailed(await response.text());
    return null;
  }

  const rows = (await response.json()) as CloudRow[];
  return rows[0] ?? null;
}

function buildCloudData(): CloudDataPayload {
  const data = createBackupData();
  return {
    ...data,
    updatedAt: getLocalUpdatedAt() ?? data.updatedAt,
    language: data.settings.language,
  };
}

function isLocalEmpty(data: Pick<BackupData, 'expenses' | 'schedules' | 'storeMemories'>) {
  return data.expenses.length === 0 && data.schedules.length === 0 && data.storeMemories.length === 0;
}

function attachOnlineListeners() {
  if (onlineListenersAttached) {
    return;
  }

  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('online', requestCloudSync);
  window.addEventListener('offline', markPending);
  onlineListenersAttached = true;
}

function markPending() {
  setStorageItem(PENDING_SYNC_KEY, 'true');
  setState({ status: 'pending' });
}

function markFailed(error?: string) {
  setStorageItem(PENDING_SYNC_KEY, 'true');
  setState({ status: 'failed', error });
}

function setState(nextState: Partial<CloudSyncState>) {
  state = { ...state, ...nextState };
  listeners.forEach((listener) => listener(state));
}

function getSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && anonKey ? { url: url.replace(/\/$/, ''), anonKey } : null;
}

function generateRecoveryCode() {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const value = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join('');
  return `SB-${value.slice(0, 4)}-${value.slice(4)}`;
}

function createUuid() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function getSavedProfile(): CloudProfile | null {
  const raw = getStorageItem(CLOUD_PROFILE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CloudProfile;
  } catch {
    return null;
  }
}

function saveProfile(profile: CloudProfile) {
  setStorageItem(DEVICE_ID_KEY, profile.deviceId);
  setStorageItem(RECOVERY_CODE_KEY, profile.recoveryCode);
  setStorageItem(CLOUD_PROFILE_KEY, JSON.stringify(profile));
}

function isOnline() {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

function getStorageItem(key: string) {
  return typeof localStorage === 'undefined' ? null : localStorage.getItem(key);
}

function setStorageItem(key: string, value: string) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

function removeStorageItem(key: string) {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
  }
}
