import { describe, expect, it } from 'vitest';
import type { Schedule } from '../types/schedule';
import { createGoogleCalendarUrl, createIcsContent } from './calendarExport';

const schedule: Schedule = {
  id: 'schedule-1',
  title: 'ホテル現場確認',
  date: '2026-07-01',
  startTime: '10:00',
  note: '担当者に連絡',
  syncedToCalendar: true,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

describe('calendar export', () => {
  it('creates an ICS event with a 30 minute default end time', () => {
    const ics = createIcsContent(schedule);

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('UID:schedule-1@minimal-expense-app');
    expect(ics).toContain('SUMMARY:ホテル現場確認');
    expect(ics).toContain('DESCRIPTION:担当者に連絡');
    expect(ics).toContain('DTSTART:20260701T100000');
    expect(ics).toContain('DTEND:20260701T103000');
  });

  it('creates a Google Calendar URL with encoded event data', () => {
    const url = createGoogleCalendarUrl({
      ...schedule,
      endTime: '11:15',
    });

    expect(url).toContain('https://calendar.google.com/calendar/render?action=TEMPLATE');
    expect(url).toContain('text=%E3%83%9B%E3%83%86%E3%83%AB%E7%8F%BE%E5%A0%B4%E7%A2%BA%E8%AA%8D');
    expect(url).toContain('dates=20260701T100000%2F20260701T111500');
    expect(url).toContain('details=%E6%8B%85%E5%BD%93%E8%80%85%E3%81%AB%E9%80%A3%E7%B5%A1');
  });
});
