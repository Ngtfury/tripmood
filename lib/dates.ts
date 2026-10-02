import { TRIP_CONFIG } from './constants';

/**
 * Returns today's date in YYYY-MM-DD format based on the specified timezone (defaults to Asia/Kolkata).
 */
export function getTodayInTimezone(timeZone = TRIP_CONFIG.timezone): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  } catch {
    // Fallback if timezone not supported
    const now = new Date();
    return now.toISOString().slice(0, 10);
  }
}

/**
 * Checks whether a given YYYY-MM-DD date is strictly in the future compared to today in the given timezone.
 */
export function isDateInFuture(dateStr: string, timeZone = TRIP_CONFIG.timezone): boolean {
  const today = getTodayInTimezone(timeZone);
  return dateStr > today;
}

/**
 * Checks whether a date is within the valid trip range: Oct 1, 2026 -> Dec 10, 2026.
 */
export function isDateWithinTripRange(dateStr: string): boolean {
  return dateStr >= TRIP_CONFIG.startDate && dateStr <= TRIP_CONFIG.targetDate;
}

export interface CountdownResult {
  isTripTime: boolean;
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Computes live countdown towards the trip target date in Asia/Kolkata.
 * Dec 10, 2026 00:00:00 IST = 2026-12-09T18:30:00Z
 */
export function calculateTripCountdown(): CountdownResult {
  const now = new Date();
  
  // Target: December 10, 2026 at 00:00:00 IST (+05:30)
  const target = new Date('2026-12-10T00:00:00+05:30');
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return {
      isTripTime: true,
      totalSeconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    isTripTime: false,
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
  };
}

export interface CalendarDayInfo {
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1 to 71
  monthName: string;
  monthShort: string;
  monthIndex: string; // "10", "11", "12"
  dayOfMonth: number;
  dayOfWeek: string;
  formattedDate: string;
}

/**
 * Generates the full 71-day calendar structure from Oct 01, 2026 to Dec 10, 2026.
 */
export function generateTripCalendar(): CalendarDayInfo[] {
  const days: CalendarDayInfo[] = [];
  const start = new Date(2026, 9, 1); // Month is 0-indexed, so 9 = October
  const total = TRIP_CONFIG.totalDays; // 71

  for (let i = 0; i < total; i++) {
    const current = new Date(2026, 9, 1 + i);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthShorts = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const monthName = monthNames[current.getMonth()];
    const monthShort = monthShorts[current.getMonth()];
    const dayOfWeek = dayNames[current.getDay()];

    days.push({
      date: dateStr,
      dayNumber: i + 1,
      monthName,
      monthShort,
      monthIndex: month,
      dayOfMonth: current.getDate(),
      dayOfWeek,
      formattedDate: `${monthShort} ${String(current.getDate()).padStart(2, '0')}`,
    });
  }

  return days;
}

/**
 * Formats a date string into a friendly label like "October 2" or "Thursday, Oct 02".
 */
export function formatFriendlyDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
