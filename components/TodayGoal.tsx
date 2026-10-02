'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Heart, Sparkles, Plus, Edit3 } from 'lucide-react';
import { calculateDailyBreakdown } from '@/lib/calculations';
import { DailyContribution } from '@/types';
import { formatFriendlyDate } from '@/lib/dates';

interface TodayGoalProps {
  todayDate: string;
  todayContribution?: DailyContribution;
  onOpenSheet: (date: string) => void;
}

export function TodayGoal({
  todayDate,
  todayContribution,
  onOpenSheet,
}: TodayGoalProps) {
  const sreeramAmount = todayContribution?.sreeram_amount ?? 0;
  const niyaaAmount = todayContribution?.niyaa_amount ?? 0;

  const {
    baselineCounted,
    bonusAmount,
    totalDayAmount,
    isComplete,
  } = calculateDailyBreakdown(sreeramAmount, niyaaAmount);

  const formattedDate = formatFriendlyDate(todayDate);
  const hasAnySavings = totalDayAmount > 0;

  return (
    <section className="px-5 my-4">
      <div className="bg-[#16171D] rounded-3xl p-5 border border-white/5 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow if completed */}
        {isComplete && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E08A9B]/10 rounded-full blur-2xl pointer-events-none" />
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest text-[#8E8B99] uppercase">
              TODAY&apos;S LITTLE GOAL
            </span>
          </div>

          <span className="text-xs font-mono text-[#F3E8D2]/80 bg-[#101116] px-2.5 py-0.5 rounded-full border border-white/5">
            {formattedDate}
          </span>
        </div>

        {/* Both Partners Contribution Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Sreeram */}
          <div className="bg-[#101116] rounded-2xl p-3.5 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#8E8B99] mb-1">
              <span>Sreeram</span>
              {sreeramAmount >= 50 && (
                <span className="w-4 h-4 rounded-full bg-[#E08A9B]/20 text-[#E08A9B] flex items-center justify-center text-[10px]">
                  ✓
                </span>
              )}
            </div>
            <div className="text-xl font-bold text-[#F6F4EE]">
              ₹{sreeramAmount}
              <span className="text-xs font-normal text-[#8E8B99] ml-1">/ ₹50</span>
            </div>
          </div>

          {/* Niyaa */}
          <div className="bg-[#101116] rounded-2xl p-3.5 border border-white/5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#8E8B99] mb-1">
              <span>Niyaa</span>
              {niyaaAmount >= 50 && (
                <span className="w-4 h-4 rounded-full bg-[#E08A9B]/20 text-[#E08A9B] flex items-center justify-center text-[10px]">
                  ✓
                </span>
              )}
            </div>
            <div className="text-xl font-bold text-[#F6F4EE]">
              ₹{niyaaAmount}
              <span className="text-xs font-normal text-[#8E8B99] ml-1">/ ₹50</span>
            </div>
          </div>
        </div>

        {/* State Banner: Packed vs In Progress */}
        <div className="bg-[#101116]/80 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {isComplete ? (
                <motion.div
                  key="complete-check"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                  className="w-10 h-10 rounded-2xl bg-[#E08A9B]/20 border border-[#E08A9B]/40 flex items-center justify-center relative shrink-0"
                >
                  <Check className="w-5 h-5 text-[#E08A9B]" strokeWidth={2.5} />
                  {/* Floating heart micro-particle */}
                  <motion.div
                    initial={{ y: 0, opacity: 1, scale: 0.8 }}
                    animate={{ y: -16, opacity: 0, scale: 1.2 }}
                    transition={{ duration: 1.2, ease: 'easeOut', repeat: Infinity, repeatDelay: 3 }}
                    className="absolute -top-1 pointer-events-none"
                  >
                    <Heart className="w-3 h-3 text-[#E08A9B] fill-[#E08A9B]" />
                  </motion.div>
                </motion.div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-[#1C1D24] border border-white/5 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#F3E8D2]/60" />
                </div>
              )}
            </AnimatePresence>

            <div>
              <div className="text-sm font-semibold text-[#F6F4EE]">
                {isComplete ? (
                  <span className="flex items-center gap-1.5 text-[#F6F4EE]">
                    Today is packed <Heart className="w-3.5 h-3.5 text-[#E08A9B] fill-[#E08A9B] inline" />
                  </span>
                ) : (
                  <span>₹{totalDayAmount} saved today</span>
                )}
              </div>

              <div className="text-xs text-[#8E8B99] mt-0.5">
                {isComplete ? (
                  <span>
                    ₹{baselineCounted} trip fund{bonusAmount > 0 ? ` + ₹${bonusAmount} bonus` : ''}
                  </span>
                ) : (
                  <span>₹{100 - baselineCounted} more to complete today</span>
                )}
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => onOpenSheet(todayDate)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1D24] hover:bg-[#252630] border border-white/10 text-xs font-semibold text-[#F6F4EE] transition-all active:scale-95 shadow-sm"
          >
            {hasAnySavings ? (
              <>
                <Edit3 className="w-3.5 h-3.5 text-[#E08A9B]" />
                <span>Edit</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-[#E08A9B]" />
                <span>Pack</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
