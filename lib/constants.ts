export const TRIP_CONFIG = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Sreeram × Niyaa',
  tripName: 'Christmas vacation trip',
  startDate: '2026-10-01',
  targetDate: '2026-12-10',
  dailyPersonAmount: 50,
  combinedDailyBaseline: 100,
  mainTarget: 7100,
  totalDays: 71,
  timezone: 'Asia/Kolkata',
  minValidAmount: 50,
} as const;

export const MONTH_NAMES = {
  '10': 'October',
  '11': 'November',
  '12': 'December',
} as const;

export const APP_THEME = {
  background: '#0A0A0D',
  secondaryBg: '#101116',
  cardSurface: '#16171D',
  elevatedSurface: '#1C1D24',
  textPrimary: '#F6F4EE',
  textSecondary: '#8E8B99',
  accentPink: '#E08A9B', // dusty rose
  accentCream: '#F3E8D2', // champagne
  accentBurgundy: '#4A1B24',
} as const;
