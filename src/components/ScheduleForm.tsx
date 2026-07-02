import { FormEvent, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { Schedule } from '../types/schedule';

type ScheduleFormProps = {
  mode: 'create' | 'edit';
  initialDate?: string;
  schedule?: Schedule;
  onCancel: () => void;
  onSave: (schedule: Schedule) => void;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function ScheduleForm({ mode, initialDate, schedule, onCancel, onSave }: ScheduleFormProps) {
  const { t } = useLanguage();
  const [title, setTitle] = useState(schedule?.title ?? '');
  const [date, setDate] = useState(schedule?.date ?? initialDate ?? today());
  const [startTime, setStartTime] = useState(schedule?.startTime ?? '10:00');
  const [endTime, setEndTime] = useState(schedule?.endTime ?? '');
  const [note, setNote] = useState(schedule?.note ?? '');
  const [syncedToCalendar, setSyncedToCalendar] = useState(schedule?.syncedToCalendar ?? false);
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setMessage(t.schedule.requiredTitle);
      return;
    }

    const now = new Date().toISOString();
    onSave({
      id: schedule?.id ?? crypto.randomUUID(),
      title: title.trim(),
      date,
      startTime,
      endTime: endTime || undefined,
      note: note.trim() || undefined,
      syncedToCalendar,
      createdAt: schedule?.createdAt ?? now,
      updatedAt: now,
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-950">
          {mode === 'create' ? t.schedule.addTitle : t.schedule.editTitle}
        </h1>
        <button className="rounded-full px-3 py-2 text-sm font-semibold text-gray-500" type="button" onClick={onCancel}>
          {t.form.cancel}
        </button>
      </header>

      <section className="space-y-4 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <label className="block">
          <span className="text-sm font-semibold text-gray-600">{t.schedule.titleField}</span>
          <input
            className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 text-gray-950 outline-none"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-600">{t.schedule.dateField}</span>
          <input
            className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 text-gray-950 outline-none"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-semibold text-gray-600">{t.schedule.startTimeField}</span>
            <input
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 text-gray-950 outline-none"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-gray-600">{t.schedule.endTimeField}</span>
            <input
              className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 text-gray-950 outline-none"
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-gray-600">{t.schedule.noteField}</span>
          <textarea
            className="mt-2 min-h-24 w-full resize-none rounded-2xl bg-gray-100 px-4 py-3 text-gray-950 outline-none"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </label>
      </section>

      <label className="flex items-center justify-between gap-4 rounded-[2rem] bg-white p-5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100">
        <span>{t.schedule.syncField}</span>
        <input
          checked={syncedToCalendar}
          className="h-5 w-5 accent-gray-950"
          type="checkbox"
          onChange={(event) => setSyncedToCalendar(event.target.checked)}
        />
      </label>

      {message ? <p className="rounded-2xl bg-white p-4 text-sm font-medium text-red-600">{message}</p> : null}

      <button
        className="w-full rounded-3xl bg-gray-950 px-5 py-4 text-lg font-bold text-white shadow-sm transition hover:bg-gray-800"
        type="submit"
      >
        {mode === 'create' ? t.schedule.saveCreate : t.schedule.saveEdit}
      </button>
    </form>
  );
}
