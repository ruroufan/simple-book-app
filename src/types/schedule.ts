export type Schedule = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime?: string;
  note?: string;
  syncedToCalendar: boolean;
  createdAt: string;
  updatedAt: string;
};
