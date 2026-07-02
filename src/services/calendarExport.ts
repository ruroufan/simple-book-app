import type { Schedule } from '../types/schedule';

export function createIcsContent(schedule: Schedule) {
  const start = toCalendarDateTime(schedule.date, schedule.startTime);
  const end = toCalendarDateTime(schedule.date, schedule.endTime ?? addMinutes(schedule.startTime, 30));
  const now = toUtcStamp(new Date());

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Minimal Expense App//Schedule//ZH-JA',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${escapeIcsText(schedule.id)}@minimal-expense-app`,
    `DTSTAMP:${now}`,
    `CREATED:${toUtcStamp(new Date(schedule.createdAt))}`,
    `LAST-MODIFIED:${toUtcStamp(new Date(schedule.updatedAt))}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(schedule.title)}`,
    schedule.note ? `DESCRIPTION:${escapeIcsText(schedule.note)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}

export function downloadIcsFile(schedule: Schedule) {
  const blob = new Blob([createIcsContent(schedule)], {
    type: 'text/calendar;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeFileName(schedule.title)}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function createGoogleCalendarUrl(schedule: Schedule) {
  const start = toCalendarDateTime(schedule.date, schedule.startTime);
  const end = toCalendarDateTime(schedule.date, schedule.endTime ?? addMinutes(schedule.startTime, 30));
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: schedule.title,
    dates: `${start}/${end}`,
  });

  if (schedule.note) {
    params.set('details', schedule.note);
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function toCalendarDateTime(date: string, time: string) {
  return `${date.replace(/-/g, '')}T${time.replace(':', '')}00`;
}

function addMinutes(time: string, minutes: number) {
  const [hour, minute] = time.split(':').map(Number);
  const date = new Date(2000, 0, 1, hour, minute + minutes);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function toUtcStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcsText(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
}

function safeFileName(title: string) {
  return title.trim().replace(/[\\/:*?"<>|]/g, '-').slice(0, 40) || 'schedule';
}
