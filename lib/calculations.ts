import { TRIP_CONFIG } from './constants';
import { CalendarDayInfo } from './dates';
import { DailyContribution, DayJourneyItem, DayStatus, FundTotals } from '../types';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates individual contribution amounts:
 * - Must be an integer
 * - Must be >= 0
 * - Must be 0 or >= 50 (values 1..49 are invalid)
 */
export function validatePersonAmount(amount: unknown): ValidationResult {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { valid: false, error: 'Please enter a valid rupee amount.' };
  }

  if (!Number.isInteger(amount)) {
    return { valid: false, error: 'Amounts must be whole rupee integers without decimals.' };
  }

  if (amount < 0) {
    return { valid: false, error: 'Contributions cannot be negative.' };
  }

  if (amount > 0 && amount < TRIP_CONFIG.minValidAmount) {
    return { valid: false, error: `Each contribution is either ₹0 or at least ₹${TRIP_CONFIG.minValidAmount}.` };
  }

  return { valid: true };
}

/**
 * Calculates the daily breakdown for Sreeram & Niyaa:
 * baselineCounted: min(sreeram, 50) + min(niyaa, 50) (max ₹100)
 * bonusAmount: max(sreeram - 50, 0) + max(niyaa - 50, 0)
 */
export function calculateDailyBreakdown(sreeramAmount: number, niyaaAmount: number) {
  const sAmount = Math.max(0, Math.floor(sreeramAmount || 0));
  const nAmount = Math.max(0, Math.floor(niyaaAmount || 0));

  const sBaseline = Math.min(sAmount, TRIP_CONFIG.dailyPersonAmount);
  const nBaseline = Math.min(nAmount, TRIP_CONFIG.dailyPersonAmount);
  const baselineCounted = sBaseline + nBaseline;

  const sBonus = Math.max(sAmount - TRIP_CONFIG.dailyPersonAmount, 0);
  const nBonus = Math.max(nAmount - TRIP_CONFIG.dailyPersonAmount, 0);
  const bonusAmount = sBonus + nBonus;

  const totalDayAmount = sAmount + nAmount;
  const isComplete = baselineCounted >= TRIP_CONFIG.combinedDailyBaseline;

  return {
    sBaseline,
    nBaseline,
    baselineCounted,
    sBonus,
    nBonus,
    bonusAmount,
    totalDayAmount,
    isComplete,
  };
}

/**
 * Aggregates overall trip totals from all recorded contributions.
 * Note: Bonus NEVER inflates the main 7,100 progress target.
 */
export function calculateTripTotals(
  contributions: Record<string, DailyContribution> | DailyContribution[]
): FundTotals {
  const records = Array.isArray(contributions) ? contributions : Object.values(contributions);

  let totalBaselineCounted = 0;
  let totalBonus = 0;
  let completedDaysCount = 0;

  for (const record of records) {
    const { baselineCounted, bonusAmount, isComplete } = calculateDailyBreakdown(
      record.sreeram_amount,
      record.niyaa_amount
    );
    totalBaselineCounted += baselineCounted;
    totalBonus += bonusAmount;
    if (isComplete) {
      completedDaysCount += 1;
    }
  }

  const mainFund = totalBaselineCounted;
  const mainTarget = TRIP_CONFIG.mainTarget; // 7100
  const remainingAmount = Math.max(mainTarget - mainFund, 0);
  
  // Cap at 100%, calculated strictly on baseline fund vs target
  const progressRatio = mainTarget > 0 ? mainFund / mainTarget : 0;
  const progressPercentage = Math.min(100, Math.max(0, Number((progressRatio * 100).toFixed(2))));
  const totalMoney = mainFund + totalBonus;
  const isCompleted = mainFund >= mainTarget;

  return {
    mainFund,
    mainTarget,
    remainingAmount,
    progressPercentage,
    bonusFund: totalBonus,
    totalMoney,
    completedDaysCount,
    totalDays: TRIP_CONFIG.totalDays,
    isCompleted,
  };
}

/**
 * Builds the full 71-day journey items with status, amounts, and metadata.
 */
export function buildJourneyItems(
  calendarDays: CalendarDayInfo[],
  contributionsMap: Record<string, DailyContribution>,
  todayDate: string
): DayJourneyItem[] {
  return calendarDays.map((day) => {
    const contribution = contributionsMap[day.date];
    const sAmount = contribution?.sreeram_amount ?? 0;
    const nAmount = contribution?.niyaa_amount ?? 0;

    const { baselineCounted, bonusAmount, totalDayAmount, isComplete } = calculateDailyBreakdown(
      sAmount,
      nAmount
    );

    const isToday = day.date === todayDate;
    const isFuture = day.date > todayDate;
    const isPast = day.date < todayDate;

    let status: DayStatus = 'future';
    if (isFuture) {
      status = 'future';
    } else if (isToday) {
      status = 'today';
    } else {
      if (isComplete) {
        status = 'completed';
      } else if (baselineCounted > 0) {
        status = 'partial';
      } else {
        status = 'missed';
      }
    }

    return {
      date: day.date,
      dayNumber: day.dayNumber,
      monthName: day.monthName,
      monthShort: day.monthShort,
      dayOfMonth: day.dayOfMonth,
      dayOfWeek: day.dayOfWeek,
      formattedDate: day.formattedDate,
      status,
      isToday,
      isFuture,
      isPast,
      sreeramAmount: sAmount,
      niyaaAmount: nAmount,
      totalDayAmount,
      baselineCounted,
      bonusAmount,
      isComplete,
    };
  });
}
