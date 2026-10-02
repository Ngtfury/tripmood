'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Luggage, Plane, Sparkles } from 'lucide-react';
import { calculateTripCountdown, CountdownResult } from '@/lib/dates';
import { OfflineSyncBadge } from './OfflineSyncBadge';

interface HeroCountdownProps {
  isOnline: boolean;
  isSupabaseLive: boolean;
  pendingSyncCount: number;
}

export function HeroCountdown({
  isOnline,
  isSupabaseLive,
  pendingSyncCount,
}: HeroCountdownProps) {
  const [countdown, setCountdown] = useState<CountdownResult>(calculateTripCountdown());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCountdown(calculateTripCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format2Digits = (num: number) => String(num).padStart(2, '0');

  return (
    <header className="relative pt-6 pb-8 px-5 flex flex-col items-center text-center">
      {/* Top Header Bar with flight code & sync badge */}
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-[#8E8B99] uppercase bg-[#16171D] px-2 py-0.5 rounded border border-white/5">
            BLR → XMAS · 2026
          </span>
        </div>
        <OfflineSyncBadge
          isOnline={isOnline}
          isSupabaseLive={isSupabaseLive}
          pendingSyncCount={pendingSyncCount}
        />
      </div>

      {/* Travel-inspired visual mark: Suitcase + Heart */}
      <div className="relative mb-3 flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-[#16171D] border border-white/10 flex items-center justify-center shadow-lg relative">
          <Luggage className="w-5 h-5 text-[#F3E8D2]" strokeWidth={1.75} />
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#E08A9B] flex items-center justify-center shadow-md shadow-[#E08A9B]/20"
          >
            <Heart className="w-2.5 h-2.5 text-[#0A0A0D] fill-[#0A0A0D]" />
          </motion.div>
        </div>
      </div>

      {/* Couple Name */}
      <h1 className="text-2xl font-bold tracking-tight text-[#F6F4EE] mb-1">
        Sreeram <span className="text-[#E08A9B] font-light">×</span> Niyaa
      </h1>

      {/* Small Trip Label */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16171D]/80 border border-white/5 mb-6">
        <Sparkles className="w-3 h-3 text-[#E08A9B]" />
        <span className="text-[11px] font-semibold tracking-wider text-[#F3E8D2] uppercase">
          Christmas vacation trip
        </span>
      </div>

      {/* Countdown Card with subtle passport stamp feel */}
      <div className="w-full max-w-sm bg-[#16171D] rounded-3xl p-6 border border-white/5 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative passport watermark */}
        <div className="absolute -right-4 -bottom-4 pointer-events-none opacity-[0.06] select-none text-[#F6F4EE]">
          <Plane className="w-32 h-32" />
        </div>

        {countdown.isTripTime ? (
          <div className="py-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E08A9B]/20 text-[#E08A9B] text-xs font-semibold uppercase mb-2">
              <Plane className="w-3.5 h-3.5" /> Ready for Takeoff
            </div>
            <div className="text-3xl font-extrabold text-[#F6F4EE] tracking-tight">
              IT&apos;S TRIP TIME ✈️
            </div>
            <div className="text-sm text-[#8E8B99] mt-1 font-medium">
              December 10, 2026
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Days remaining */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-extrabold tracking-tight text-[#F6F4EE] font-mono">
                {mounted ? countdown.days : '--'}
              </span>
              <span className="text-sm font-semibold tracking-widest text-[#8E8B99] uppercase">
                days
              </span>
            </div>

            {/* Hours · Minutes · Seconds */}
            <div className="flex items-center gap-1 text-xs font-mono text-[#8E8B99] tracking-wider bg-[#101116] px-3.5 py-1.5 rounded-full border border-white/5">
              <span>{mounted ? format2Digits(countdown.hours) : '00'}h</span>
              <span className="text-white/20">·</span>
              <span>{mounted ? format2Digits(countdown.minutes) : '00'}m</span>
              <span className="text-white/20">·</span>
              <span className="text-[#E08A9B]">{mounted ? format2Digits(countdown.seconds) : '00'}s</span>
            </div>
          </div>
        )}

        {/* Small handwritten scrapbook caption */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-2">
          <span className="font-handwriting text-lg text-[#F3E8D2]/90 tracking-wide">
            “Almost time to pack.”
          </span>
        </div>
      </div>
    </header>
  );
}
