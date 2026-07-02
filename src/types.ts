import type { CategorySuggestionReason } from './types/storeMemory';

export type Language = 'zh' | 'ja';

export type ExpenseCategory =
  | 'food'
  | 'clothing'
  | 'transport'
  | 'daily'
  | 'rent'
  | 'utilities'
  | 'entertainment'
  | 'medical'
  | 'other';

export type PaymentMethod = 'cash' | 'creditCard' | 'electronic';

export type Expense = {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  time?: string;
  paymentMethod: PaymentMethod;
  storeName?: string;
  note?: string;
  receiptImageUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type ReceiptRecognitionResult = {
  amount?: number;
  date?: string;
  storeName?: string;
  detectedText?: string;
  keywords?: string[];
  suggestedCategory?: ExpenseCategory;
  suggestionReason?: CategorySuggestionReason;
};

export type Page =
  | 'dashboard'
  | 'add'
  | 'list'
  | 'detail'
  | 'schedule'
  | 'scheduleAdd'
  | 'scheduleDetail'
  | 'storeMemory'
  | 'feedback'
  | 'backup'
  | 'stats'
  | 'settings';
