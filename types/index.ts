export interface Trip {
  id: string;
  name: string;
  trip_name: string;
  start_date: string; // YYYY-MM-DD
  target_date: string; // YYYY-MM-DD
  daily_person_amount: number;
  main_target: number;
  timezone: string;
  created_at?: string;
  updated_at?: string;
}

export interface DailyContribution {
  id?: string;
  trip_id: string;
  contribution_date: string; // YYYY-MM-DD
  sreeram_amount: number;
  niyaa_amount: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export type DayStatus = 'completed' | 'partial' | 'missed' | 'today' | 'future';

export interface DayJourneyItem {
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1 to 71
  monthName: string; // "October", "November", "December"
  monthShort: string; // "OCT", "NOV", "DEC"
  dayOfMonth: number; // 1 to 31
  dayOfWeek: string; // "Thu", "Fri", etc.
  formattedDate: string; // "Oct 01"
  status: DayStatus;
  isToday: boolean;
  isFuture: boolean;
  isPast: boolean;
  sreeramAmount: number;
  niyaaAmount: number;
  totalDayAmount: number;
  baselineCounted: number;
  bonusAmount: number;
  isComplete: boolean; // baselineCounted >= 100
}

export interface FundTotals {
  mainFund: number;
  mainTarget: number;
  remainingAmount: number;
  progressPercentage: number;
  bonusFund: number;
  totalMoney: number;
  completedDaysCount: number;
  totalDays: number;
  isCompleted: boolean;
}

export interface ContributionPayload {
  trip_id: string;
  contribution_date: string;
  sreeram_amount: number;
  niyaa_amount: number;
  notes?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
