import { useState } from 'react';
import { ScheduleForm } from '../components/ScheduleForm';
import { useLanguage } from '../context/LanguageContext';
import { createGoogleCalendarUrl, downloadIcsFile } from '../services/calendarExport';
import type { Schedule } from '../types/schedule';

type ScheduleDetailProps = {
  schedule: Schedule;
  onBack: () => void;
  onDelete: (scheduleId: string) => void;
  onUpdate: (schedule: Schedule) => void;
};

export function ScheduleDetail({ schedule, onBack, onDelete, onUpdate }: ScheduleDetailProps) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ScheduleForm
        mode="edit"
        schedule={schedule}
        onCancel={() => setIsEditing(false)}
        onSave={(nextSchedule) => {
          onUpdate(nextSchedule);
          setIsEditing(false);
        }}
      />
    );
  }

  function handleDelete() {
    if (window.confirm(t.schedule.deleteConfirm)) {
      onDelete(schedule.id);
    }
  }

  function openGoogleCalendar() {
    window.open(createGoogleCalendarUrl(schedule), '_blank', 'noopener,noreferrer');
  }

  const rowClass = 'flex items-center justify-between gap-4 border-b border-gray-100 py-3 text-sm last:border-b-0';

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between gap-3">
        <button className="rounded-full px-3 py-2 text-sm font-semibold text-gray-500" type="button" onClick={onBack}>
          {t.detail.back}
        </button>
        <h1 className="text-xl font-bold text-gray-950">{t.schedule.detailTitle}</h1>
        <button
          className="rounded-full bg-gray-950 px-4 py-2 text-sm font-semibold text-white"
          type="button"
          onClick={() => setIsEditing(true)}
        >
          {t.detail.edit}
        </button>
      </header>

      <section className="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <p className="text-sm font-bold text-gray-500">
          {schedule.date} {schedule.startTime}
          {schedule.endTime ? ` - ${schedule.endTime}` : ''}
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-950">{schedule.title}</p>
        {schedule.note ? <p className="mt-3 text-sm leading-6 text-gray-600">{schedule.note}</p> : null}
      </section>

      <section className="rounded-[2rem] bg-white px-5 shadow-sm ring-1 ring-gray-100">
        <div className={rowClass}>
          <span className="text-gray-500">{t.schedule.dateField}</span>
          <span className="font-semibold text-gray-950">{schedule.date}</span>
        </div>
        <div className={rowClass}>
          <span className="text-gray-500">{t.schedule.startTimeField}</span>
          <span className="font-semibold text-gray-950">{schedule.startTime}</span>
        </div>
        <div className={rowClass}>
          <span className="text-gray-500">{t.schedule.endTimeField}</span>
          <span className="font-semibold text-gray-950">{schedule.endTime || t.common.noStore}</span>
        </div>
        <div className={rowClass}>
          <span className="text-gray-500">{t.schedule.syncField}</span>
          <span className="font-semibold text-gray-950">
            {schedule.syncedToCalendar ? t.schedule.synced : t.schedule.notSynced}
          </span>
        </div>
      </section>

      {schedule.syncedToCalendar ? (
        <section className="space-y-3">
          <button
            className="w-full rounded-3xl bg-gray-950 px-5 py-4 text-base font-bold text-white"
            type="button"
            onClick={() => downloadIcsFile(schedule)}
          >
            {t.schedule.addToPhoneCalendar}
          </button>
          <button
            className="w-full rounded-3xl bg-white px-5 py-4 text-base font-bold text-gray-950 shadow-sm ring-1 ring-gray-100"
            type="button"
            onClick={openGoogleCalendar}
          >
            {t.schedule.addToGoogleCalendar}
          </button>
        </section>
      ) : null}

      <button
        className="w-full rounded-3xl bg-red-50 px-5 py-4 text-base font-bold text-red-600"
        type="button"
        onClick={handleDelete}
      >
        {t.schedule.deleteTitle}
      </button>
    </div>
  );
}
