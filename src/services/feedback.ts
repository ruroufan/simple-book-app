import type { Language } from '../types';
import { APP_VERSION } from './backup';

const FEEDBACK_TO = 'l729455589@gmail.com';

export type FeedbackType = 'bug' | 'receipt' | 'dataLoss' | 'suggestion' | 'other';

export type FeedbackDiagnostics = {
  language: Language;
  url: string;
  userAgent: string;
  standalone: boolean;
  currentTime: string;
  appVersion: string;
  counts: {
    expenses: number;
    schedules: number;
    storeMemories: number;
  };
};

export type FeedbackPayload = {
  type: string;
  message: string;
  contact?: string;
  diagnostics: FeedbackDiagnostics;
};

export function createFeedbackDiagnostics(language: Language): FeedbackDiagnostics {
  return {
    language,
    url: window.location.href,
    userAgent: navigator.userAgent,
    standalone:
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone),
    currentTime: new Date().toISOString(),
    appVersion: APP_VERSION,
    counts: {
      expenses: readCount('minimal-expense-records'),
      schedules: readCount('minimal-expense-schedules'),
      storeMemories: readCount('minimal-expense-store-category-memory'),
    },
  };
}

export async function submitFeedback(payload: FeedbackPayload) {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Feedback request failed');
  }
}

export function buildFeedbackText(payload: FeedbackPayload) {
  const lines = [
    `Type: ${payload.type}`,
    `Contact: ${payload.contact || '-'}`,
    '',
    'Message:',
    payload.message,
    '',
    'Diagnostics:',
    `Language: ${payload.diagnostics.language}`,
    `URL: ${payload.diagnostics.url}`,
    `Standalone: ${payload.diagnostics.standalone ? 'yes' : 'no'}`,
    `Time: ${payload.diagnostics.currentTime}`,
    `App version: ${payload.diagnostics.appVersion}`,
    `User agent: ${payload.diagnostics.userAgent}`,
    `Expense count: ${payload.diagnostics.counts.expenses}`,
    `Schedule count: ${payload.diagnostics.counts.schedules}`,
    `Store memory count: ${payload.diagnostics.counts.storeMemories}`,
  ];

  return lines.join('\n');
}

export function createMailtoUrl(payload: FeedbackPayload) {
  const subject = `[简单记账] 问题反馈 - ${payload.type}`;
  const body = buildFeedbackText(payload);
  return `mailto:${FEEDBACK_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function readCount(key: string) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return 0;
  }

  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.length : 0;
  } catch {
    return 0;
  }
}
