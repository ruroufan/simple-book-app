import { useMemo, useState, type FormEvent } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  buildFeedbackText,
  createFeedbackDiagnostics,
  createMailtoUrl,
  submitFeedback,
  type FeedbackPayload,
  type FeedbackType,
} from '../services/feedback';

const feedbackTypes: FeedbackType[] = ['bug', 'receipt', 'dataLoss', 'suggestion', 'other'];

export function FeedbackForm() {
  const { language, t } = useLanguage();
  const [type, setType] = useState<FeedbackType>('bug');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'failure' | 'copied'>('idle');

  const payload = useMemo<FeedbackPayload>(
    () => ({
      type: t.feedback.options[type],
      message,
      contact,
      diagnostics: createFeedbackDiagnostics(language),
    }),
    [contact, language, message, t.feedback.options, type],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');

    try {
      await submitFeedback(payload);
      setStatus('success');
      setMessage('');
      setContact('');
    } catch {
      setStatus('failure');
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildFeedbackText(payload));
    setStatus('copied');
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <section className="rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <p className="text-sm font-bold text-gray-700">{t.feedback.type}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {feedbackTypes.map((option) => (
            <button
              key={option}
              className={`rounded-2xl px-3 py-2 text-sm font-bold ${
                type === option ? 'bg-gray-950 text-white' : 'bg-gray-100 text-gray-700'
              }`}
              type="button"
              onClick={() => setType(option)}
            >
              {t.feedback.options[option]}
            </button>
          ))}
        </div>
      </section>

      <label className="block rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <span className="text-sm font-bold text-gray-700">{t.feedback.message}</span>
        <textarea
          className="mt-3 min-h-36 w-full resize-none rounded-2xl bg-gray-100 px-4 py-3 text-base text-gray-950 outline-none focus:ring-2 focus:ring-gray-950"
          placeholder={t.feedback.messagePlaceholder}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>

      <label className="block rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <span className="text-sm font-bold text-gray-700">{t.feedback.contact}</span>
        <input
          className="mt-3 w-full rounded-2xl bg-gray-100 px-4 py-3 text-base text-gray-950 outline-none focus:ring-2 focus:ring-gray-950"
          placeholder={t.feedback.contactPlaceholder}
          value={contact}
          onChange={(event) => setContact(event.target.value)}
        />
      </label>

      {status === 'success' ? (
        <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{t.feedback.success}</p>
      ) : null}

      {status === 'failure' || status === 'copied' ? (
        <div className="space-y-3 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <p className="text-sm leading-6 text-gray-600">
            {status === 'copied' ? t.feedback.copied : t.feedback.failure}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <a
              className="rounded-2xl bg-gray-950 px-3 py-3 text-center text-sm font-bold text-white"
              href={createMailtoUrl(payload)}
            >
              {t.feedback.mailApp}
            </a>
            <button
              className="rounded-2xl bg-gray-100 px-3 py-3 text-sm font-bold text-gray-700"
              type="button"
              onClick={handleCopy}
            >
              {t.feedback.copy}
            </button>
          </div>
        </div>
      ) : null}

      <button
        className="w-full rounded-[2rem] bg-gray-950 px-5 py-4 text-base font-bold text-white disabled:opacity-50"
        disabled={status === 'submitting'}
        type="submit"
      >
        {status === 'submitting' ? t.feedback.submitting : t.feedback.submit}
      </button>
    </form>
  );
}
