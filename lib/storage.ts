import { DailyContribution } from '../types';
import { TRIP_CONFIG } from './constants';

const STORAGE_KEY = 'sreeram_niyaa_contributions_v1';
const OFFLINE_QUEUE_KEY = 'sreeram_niyaa_offline_queue_v1';

/**
 * Default starter records for initial experience (Oct 1 completed baseline).
 */
export function getInitialDefaultContributions(): Record<string, DailyContribution> {
  return {
    '2026-10-01': {
      id: 'init-seed-oct01',
      trip_id: TRIP_CONFIG.id,
      contribution_date: '2026-10-01',
      sreeram_amount: 50,
      niyaa_amount: 50,
      notes: 'Day 1 of our Christmas vacation trip fund ❤️',
      created_at: '2026-10-01T20:00:00+05:30',
      updated_at: '2026-10-01T20:00:00+05:30',
    },
  };
}

export function loadCachedContributions(): Record<string, DailyContribution> {
  if (typeof window === 'undefined') {
    return getInitialDefaultContributions();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaults = getInitialDefaultContributions();
      saveCachedContributions(defaults);
      return defaults;
    }
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : getInitialDefaultContributions();
  } catch (err) {
    console.warn('Failed to read from localStorage:', err);
    return getInitialDefaultContributions();
  }
}

export function saveCachedContributions(contributions: Record<string, DailyContribution>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contributions));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

export function queueOfflineContribution(contribution: DailyContribution): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    const queue: DailyContribution[] = raw ? JSON.parse(raw) : [];
    // Remove any previous pending write for the same date
    const filtered = queue.filter((item) => item.contribution_date !== contribution.contribution_date);
    filtered.push(contribution);
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Failed to queue offline contribution:', err);
  }
}

export function getOfflineQueue(): DailyContribution[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearOfflineQueue(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
  } catch {
    // ignore
  }
}
