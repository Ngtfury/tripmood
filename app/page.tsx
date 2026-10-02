'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HeroCountdown } from '@/components/HeroCountdown';
import { FundJourney } from '@/components/FundJourney';
import { TodayGoal } from '@/components/TodayGoal';
import { JourneyTimeline } from '@/components/JourneyTimeline';
import { BonusFund } from '@/components/BonusFund';
import { SummaryFooter } from '@/components/SummaryFooter';
import { ContributionSheet } from '@/components/ContributionSheet';
import { TripCompleteModal } from '@/components/TripCompleteModal';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { Toast } from '@/components/Toast';
import { soundEffects } from '@/lib/audio';

import { TRIP_CONFIG } from '@/lib/constants';
import {
  generateTripCalendar,
  getTodayInTimezone,
  isDateInFuture,
} from '@/lib/dates';
import {
  buildJourneyItems,
  calculateTripTotals,
  calculateDailyBreakdown,
} from '@/lib/calculations';
import {
  loadCachedContributions,
  saveCachedContributions,
  queueOfflineContribution,
  getOfflineQueue,
  clearOfflineQueue,
} from '@/lib/storage';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { DailyContribution, ToastMessage } from '@/types';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Contributions map keyed by date: "YYYY-MM-DD"
  const [contributions, setContributions] = useState<Record<string, DailyContribution>>({});

  // UI modal states
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [celebrationShownOnce, setCelebrationShownOnce] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Determine today's date in Asia/Kolkata
  const todayDate = useMemo(() => getTodayInTimezone(TRIP_CONFIG.timezone), []);

  // Generate calendar days for the trip
  const calendarDays = useMemo(() => generateTripCalendar(), []);

  // Compute 71-day journey items
  const journeyItems = useMemo(() => {
    return buildJourneyItems(calendarDays, contributions, todayDate);
  }, [calendarDays, contributions, todayDate]);

  // Compute aggregate totals
  const totals = useMemo(() => {
    return calculateTripTotals(contributions);
  }, [contributions]);

  // Today's contribution record
  const todayContribution = contributions[todayDate];
  const isTodayComplete = useMemo(() => {
    if (!todayContribution) return false;
    const { isComplete } = calculateDailyBreakdown(
      todayContribution.sreeram_amount,
      todayContribution.niyaa_amount
    );
    return isComplete;
  }, [todayContribution]);

  // Valid dates eligible for saving (Oct 1 through Today, no future dates)
  const validDatesForPicker = useMemo(() => {
    return calendarDays
      .filter((day) => !isDateInFuture(day.date, TRIP_CONFIG.timezone))
      .map((day) => ({
        date: day.date,
        label: `${day.formattedDate} (${day.dayOfWeek})`,
      }))
      .reverse(); // most recent first
  }, [calendarDays]);

  // 1. Initial Load & Offline Cache
  useEffect(() => {
    setMounted(true);
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);

    // Load local cache instantly
    const cached = loadCachedContributions();
    setContributions(cached);

    const pending = getOfflineQueue();
    setPendingSyncCount(pending.length);

    // Online/offline listeners
    const handleOnline = () => {
      setIsOnline(true);
      addToast('Back online! Syncing your travel journal...', 'info');
      syncPendingQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      addToast('Offline mode active. Your savings stay safe on device.', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Fetch latest from API/Supabase
    fetchContributions();

    // Setup Supabase Realtime if configured
    let channelSubscription: any = null;
    const supabase = getSupabaseClient();

    if (supabase && isSupabaseConfigured()) {
      setIsSupabaseLive(true);

      channelSubscription = supabase
        .channel('daily_contributions_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'daily_contributions',
            filter: `trip_id=eq.${TRIP_CONFIG.id}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const newRecord = payload.new as DailyContribution;
              setContributions((prev) => {
                const next = { ...prev, [newRecord.contribution_date]: newRecord };
                saveCachedContributions(next);
                return next;
              });
              addToast('Shared journal updated in real time ✨', 'info');
            } else if (payload.eventType === 'DELETE') {
              const oldRecord = payload.old as DailyContribution;
              setContributions((prev) => {
                const next = { ...prev };
                delete next[oldRecord.contribution_date];
                saveCachedContributions(next);
                return next;
              });
            }
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (channelSubscription && supabase) {
        supabase.removeChannel(channelSubscription);
      }
    };
  }, [addToast]);

  // 2. Celebration Trigger
  useEffect(() => {
    if (totals.isCompleted && !celebrationShownOnce) {
      setIsCelebrationOpen(true);
      setCelebrationShownOnce(true);
    }
  }, [totals.isCompleted, celebrationShownOnce]);

  // Fetch contributions from server
  const fetchContributions = async () => {
    try {
      const res = await fetch(`/api/contributions?trip_id=${TRIP_CONFIG.id}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: Record<string, DailyContribution> = {};
        for (const item of json.data) {
          mapped[item.contribution_date] = item;
        }
        setContributions((prev) => {
          const merged = { ...prev, ...mapped };
          saveCachedContributions(merged);
          return merged;
        });
      }
    } catch (err) {
      console.warn('Network fetch error, using local cached data:', err);
    }
  };

  // Sync queued offline contributions when reconnected
  const syncPendingQueue = async () => {
    const queue = getOfflineQueue();
    if (queue.length === 0) return;

    for (const item of queue) {
      try {
        await fetch('/api/contributions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      } catch (err) {
        console.error('Queue sync error:', err);
      }
    }

    clearOfflineQueue();
    setPendingSyncCount(0);
    fetchContributions();
  };

  // Save or Edit a Contribution
  const handleSaveContribution = async (payload: {
    date: string;
    sreeram: number;
    niyaa: number;
    notes?: string;
  }) => {
    // 1. Client-side Future Date Check
    if (isDateInFuture(payload.date, TRIP_CONFIG.timezone)) {
      throw new Error("That day hasn't happened yet ✦");
    }

    const previousRecord = contributions[payload.date];

    // 2. Optimistic Update
    const optimisticRecord: DailyContribution = {
      trip_id: TRIP_CONFIG.id,
      contribution_date: payload.date,
      sreeram_amount: payload.sreeram,
      niyaa_amount: payload.niyaa,
      notes: payload.notes,
      updated_at: new Date().toISOString(),
    };

    setContributions((prev) => {
      const next = { ...prev, [payload.date]: optimisticRecord };
      saveCachedContributions(next);
      return next;
    });

    // 3. Send to Server API
    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optimisticRecord),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        // Rollback optimistic update
        setContributions((prev) => {
          const next = { ...prev };
          if (previousRecord) {
            next[payload.date] = previousRecord;
          } else {
            delete next[payload.date];
          }
          saveCachedContributions(next);
          return next;
        });
        throw new Error(json.error || "That didn't save. Try again?");
      }

      // Update with server confirmed record
      if (json.data) {
        setContributions((prev) => {
          const next = { ...prev, [payload.date]: json.data };
          saveCachedContributions(next);
          return next;
        });
      }

      soundEffects.playCuteBellRing();
      addToast('Saved to your travel journal 🔔❤️', 'success');
    } catch (err: unknown) {
      if (!navigator.onLine) {
        // Offline handling
        queueOfflineContribution(optimisticRecord);
        setPendingSyncCount((prev) => prev + 1);
        addToast('Saved locally. Will sync when back online.', 'info');
      } else {
        throw err;
      }
    }
  };

  const handleOpenSheetForDate = (date: string) => {
    if (isDateInFuture(date, TRIP_CONFIG.timezone)) {
      addToast("That day hasn't happened yet ✦", 'error');
      return;
    }
    setSelectedDate(date);
    setIsSheetOpen(true);
  };

  const handleOpenSheetDefault = () => {
    setSelectedDate(todayDate);
    setIsSheetOpen(true);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0A0A0D] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#16171D] border border-white/10 flex items-center justify-center mb-3">
          <span className="text-[#E08A9B] text-xl">❤️</span>
        </div>
        <h1 className="text-lg font-bold text-[#F6F4EE]">Sreeram × Niyaa</h1>
        <p className="text-xs text-[#8E8B99] mt-1">Opening our travel journal...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0D] text-[#F6F4EE] flex justify-center">
      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Mobile-sized Container */}
      <div className="w-full max-w-[428px] min-h-screen bg-[#0A0A0D] shadow-2xl relative flex flex-col safe-top safe-bottom-fab">
        {/* 1. Trip Identity & Live Countdown */}
        <HeroCountdown
          isOnline={isOnline}
          isSupabaseLive={isSupabaseLive}
          pendingSyncCount={pendingSyncCount}
        />

        {/* 2. Main Fund Experience */}
        <FundJourney totals={totals} />

        {/* 3. Today's Little Goal */}
        <TodayGoal
          todayDate={todayDate}
          todayContribution={todayContribution}
          onOpenSheet={handleOpenSheetForDate}
        />

        {/* 4. Saving Journey Timeline */}
        <JourneyTimeline
          items={journeyItems}
          onSelectDate={handleOpenSheetForDate}
        />

        {/* 5. Bonus Fund ("A Little Extra") */}
        <BonusFund totals={totals} />

        {/* 6. Summary Footer */}
        <SummaryFooter
          totals={totals}
          onOpenCelebration={() => setIsCelebrationOpen(true)}
        />

        {/* Sticky Scrapbook Floating Action Button */}
        <FloatingActionButton
          onClick={handleOpenSheetDefault}
          todayPacked={isTodayComplete}
        />

        {/* Bottom Sheet for Adding/Editing Contributions */}
        <ContributionSheet
          isOpen={isSheetOpen}
          selectedDate={selectedDate || todayDate}
          existingContribution={contributions[selectedDate || todayDate]}
          todayDate={todayDate}
          onClose={() => setIsSheetOpen(false)}
          onSave={handleSaveContribution}
          validDates={validDatesForPicker}
        />

        {/* Trip Complete Celebration Modal */}
        <TripCompleteModal
          isOpen={isCelebrationOpen}
          onClose={() => setIsCelebrationOpen(false)}
          totalSaved={totals.totalMoney}
          bonusAmount={totals.bonusFund}
        />
      </div>
    </main>
  );
}
