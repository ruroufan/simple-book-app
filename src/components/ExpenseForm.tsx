import { FormEvent, useState } from 'react';
import { categoryKeys, paymentMethodKeys } from '../i18n/translations';
import { recognizeReceipt } from '../services/receiptRecognition';
import { getStoreCategoryMemories, suggestCategory } from '../services/storeCategoryMemory';
import { useLanguage } from '../context/LanguageContext';
import type { Expense, ExpenseCategory, PaymentMethod } from '../types';
import type { CategorySuggestionReason } from '../types/storeMemory';

type ExpenseFormProps = {
  mode: 'create' | 'edit';
  expense?: Expense;
  onCancel: () => void;
  onSave: (expense: Expense) => void;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function nowTime() {
  return new Date().toTimeString().slice(0, 5);
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ExpenseForm({ mode, expense, onCancel, onSave }: ExpenseFormProps) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(expense ? String(expense.amount) : '');
  const [category, setCategory] = useState<ExpenseCategory>(expense?.category ?? 'food');
  const [date, setDate] = useState(expense?.date ?? today());
  const [time, setTime] = useState(expense?.time ?? nowTime());
  const [storeName, setStoreName] = useState(expense?.storeName ?? '');
  const [note, setNote] = useState(expense?.note ?? '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(expense?.paymentMethod ?? 'electronic');
  const [receiptImageUrl, setReceiptImageUrl] = useState(expense?.receiptImageUrl ?? '');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [message, setMessage] = useState('');
  const [suggestionReason, setSuggestionReason] = useState<CategorySuggestionReason | undefined>();

  async function handleReceiptChange(file: File | undefined) {
    if (!file) {
      return;
    }

    setIsRecognizing(true);
    setMessage('');
    setSuggestionReason(undefined);
    const imageUrl = await fileToDataUrl(file);
    setReceiptImageUrl(imageUrl);

    try {
      const result = await recognizeReceipt(file);
      const nextStoreName = result.storeName ?? storeName;
      const suggestion = suggestCategory({
        storeName: nextStoreName,
        detectedText: result.detectedText,
        userMemoryList: getStoreCategoryMemories(),
      });

      if (result.amount) {
        setAmount(String(result.amount));
      }
      if (result.date) {
        setDate(result.date);
      }
      if (nextStoreName) {
        setStoreName(nextStoreName);
      }
      setCategory(suggestion.category);
      setSuggestionReason(suggestion.reason);
      setMessage(suggestion.reason === 'memory' ? t.form.autoClassifiedByMemory : t.form.recognized);
    } catch {
      setMessage(t.form.unclear);
    } finally {
      setIsRecognizing(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setMessage(t.form.required);
      return;
    }

    const now = new Date().toISOString();
    onSave({
      id: expense?.id ?? crypto.randomUUID(),
      amount: numericAmount,
      category,
      date,
      time: time || undefined,
      paymentMethod,
      storeName: storeName.trim() || undefined,
      note: note.trim() || undefined,
      receiptImageUrl: receiptImageUrl || undefined,
      createdAt: expense?.createdAt ?? now,
      updatedAt: now,
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-950">
          {mode === 'create' ? t.form.createTitle : t.form.editTitle}
        </h1>
        <button className="rounded-full px-3 py-2 text-sm font-semibold text-gray-500" type="button" onClick={onCancel}>
          {t.form.cancel}
        </button>
      </header>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <label className="text-sm font-semibold text-gray-600" htmlFor="amount">
          {t.form.amount}
        </label>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-3xl font-bold text-gray-400">¥</span>
          <input
            className="min-w-0 flex-1 bg-transparent text-4xl font-bold text-gray-950 outline-none"
            id="amount"
            inputMode="decimal"
            min="0"
            placeholder="0"
            type="number"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <label className="text-sm font-semibold text-gray-600">{t.form.category}</label>
        {suggestionReason === 'memory' ? (
          <p className="mt-2 rounded-2xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600">
            {t.form.autoClassifiedByMemory}
          </p>
        ) : null}
        <div className="mt-3 grid grid-cols-3 gap-2">
          {categoryKeys.map((key) => (
            <button
              key={key}
              className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                category === key ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-700'
              }`}
              type="button"
              onClick={() => setCategory(key)}
            >
              {t.categories[key]}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-semibold text-gray-600">{t.form.date}</span>
            <input
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 text-gray-950 outline-none"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-600">{t.form.time}</span>
            <input
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 text-gray-950 outline-none"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-gray-600">{t.form.storeName}</span>
          <input
            className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 text-gray-950 outline-none"
            placeholder="FamilyMart"
            type="text"
            value={storeName}
            onChange={(event) => setStoreName(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-600">{t.form.note}</span>
          <input
            className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 text-gray-950 outline-none"
            placeholder={t.form.notePlaceholder}
            type="text"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <label className="text-sm font-semibold text-gray-600">{t.form.paymentMethod}</label>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {paymentMethodKeys.map((key) => (
            <button
              key={key}
              className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                paymentMethod === key ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-700'
              }`}
              type="button"
              onClick={() => setPaymentMethod(key)}
            >
              {t.paymentMethods[key]}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <label className="block">
          <span className="text-sm font-semibold text-gray-600">{t.form.receipt}</span>
          <span className="mt-1 block text-xs text-gray-500">{t.form.receiptHelp}</span>
          <input
            accept="image/*"
            capture="environment"
            className="mt-3 w-full rounded-2xl bg-gray-100 px-3 py-3 text-sm text-gray-600"
            type="file"
            onChange={(event) => void handleReceiptChange(event.target.files?.[0])}
          />
        </label>

        {isRecognizing ? <p className="mt-3 text-sm text-gray-500">{t.form.recognizing}</p> : null}
        {message ? <p className="mt-3 text-sm font-medium text-gray-700">{message}</p> : null}
        {receiptImageUrl ? (
          <img className="mt-4 h-44 w-full rounded-3xl object-cover" alt={t.form.receipt} src={receiptImageUrl} />
        ) : null}
      </section>

      <button
        className="w-full rounded-3xl bg-gray-950 px-5 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-gray-800"
        type="submit"
      >
        {mode === 'create' ? t.form.saveCreate : t.form.saveEdit}
      </button>
    </form>
  );
}
