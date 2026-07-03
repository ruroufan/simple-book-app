import type { BackupData } from '../services/backup';

export type CloudSyncStatus = 'disabled' | 'synced' | 'syncing' | 'pending' | 'failed';

export type CloudProfile = {
  id: string;
  deviceId: string;
  recoveryCode: string;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string;
};

export type CloudSyncState = {
  status: CloudSyncStatus;
  recoveryCode?: string;
  lastSyncedAt?: string;
  error?: string;
};

export type CloudDataPayload = BackupData & {
  language: 'zh' | 'ja';
};

export type CloudRow = {
  id: string;
  device_id: string;
  recovery_code: string;
  data: CloudDataPayload;
  created_at: string;
  updated_at: string;
};
