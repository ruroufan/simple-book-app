import type { Schedule } from '../types/schedule';
import { writeLatestBackup } from './backup';
import { setPersistentData } from './persistentStorage';

const SCHEDULES_KEY = 'minimal-expense-schedules';

export function getSchedules(): Schedule[] {
  const raw = localStorage.getItem(SCHEDULES_KEY);
  if (!raw) {
    return [];
  }

  try {
    const schedules = JSON.parse(raw) as Partial<Schedule>[];
    return Array.isArray(schedules) ? schedules.map(normalizeSchedule).filter(isSchedule) : [];
  } catch {
    return [];
  }
}

export function saveSchedules(schedules: Schedule[]) {
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
  void setPersistentData('schedules', schedules);
  writeLatestBackup();
}

export function addSchedule(schedule: Schedule) {
  const nextSchedules = [schedule, ...getSchedules()];
  saveSchedules(nextSchedules);
  return nextSchedules;
}

export function updateSchedule(updatedSchedule: Schedule) {
  const nextSchedules = getSchedules().map((schedule) =>
    schedule.id === updatedSchedule.id ? updatedSchedule : schedule,
  );
  saveSchedules(nextSchedules);
  return nextSchedules;
}

export function deleteSchedule(scheduleId: string) {
  const nextSchedules = getSchedules().filter((schedule) => schedule.id !== scheduleId);
  saveSchedules(nextSchedules);
  return nextSchedules;
}

function normalizeSchedule(schedule: Partial<Schedule>): Schedule | null {
  if (!schedule.id || !schedule.title || !schedule.date || !schedule.startTime) {
    return null;
  }

  const createdAt = schedule.createdAt ?? new Date().toISOString();

  return {
    id: schedule.id,
    title: schedule.title,
    date: schedule.date,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    note: schedule.note,
    syncedToCalendar: Boolean(schedule.syncedToCalendar),
    createdAt,
    updatedAt: schedule.updatedAt ?? createdAt,
  };
}

function isSchedule(schedule: Schedule | null): schedule is Schedule {
  return schedule !== null;
}
