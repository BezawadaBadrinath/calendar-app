import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO } from "date-fns";

export function getMonthDays(month, year) {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }
  return days;
}

export function isToday(date) {
  return isSameDay(date, new Date());
}

export function formatDate(date) {
  return format(date, "yyyy-MM-dd");
}

export function isCurrentMonth(date, month, year) {
  return isSameMonth(date, new Date(year, month));
}

// Helper to check if two events overlap
export function eventsOverlap(eventA, eventB) {
  // Both events are on the same date
  if (eventA.date !== eventB.date) return false;
  // Compare times as "HH:MM"
  return (
    eventA.startTime < eventB.endTime &&
    eventB.startTime < eventA.endTime
  );
}