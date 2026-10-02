'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar } from 'lucide-react';
import { FundTotals } from '@/types';

interface FundJourneyProps {
  totals: FundTotals;
}

export function FundJourney({ totals }: FundJourneyProps) {
  const formattedSaved = new Intl.NumberFormat('en-IN').format(totals.mainFund);
  const formattedTarget = new Intl.NumberFormat('en-IN').format(totals.mainTarget);
  const formattedRemaining = new Intl.NumberFormat('en-IN').format(totals.remainingAmount);

  return (
    <section className="px-5 my-3">
      {/* Travel Pass / Journal Sheet Card */}
      <div className="relative bg-[#16171D] rounded-3xl p-6 border border-white/5 shadow-xl overflow-hidden">
        {/* Subtle decorative washi tape accent at top center */}
        <div className="washi-tape" />

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 mt-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E08A9B]" />
            <span className="text-[11px] font-bold tracking-widest text-[#8E8B99] uppercase">
              OUR TRIP FUND
            </span>
          </div>

          <div className="px-2.5 py-0.5 rounded-full bg-[#E08A9B]/10 border border-[#E08A9B]/20 text-[11px] font-semibold text-[#E08A9B]">
            {totals.progressPercentage.toFixed(1)}%
          </div>
        </div>

        {/* Main Amount */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-4xl font-extrabold text-[#F6F4EE] tracking-tight">
            ₹{formattedSaved}
          </span>
          <span className="text-base text-[#8E8B99] font-medium">
            of ₹{formattedTarget}
          </span>
        </div>

        <p className="text-xs text-[#8E8B99] mb-6">
          Shared holiday savings for December
        </p>

        {/* Visual Journey Trail */}
        <div className="relative my-6 px-1">
          {/* Background trail track */}
          <div className="h-2 w-full bg-[#101116] rounded-full overflow-hidden p-0.5 border border-white/5 relative">
            {/* Animated Progress Fill */}
            <motion.div
              className="h-full bg-gradient-to-r from-[#E08A9B] via-[#E298A6] to-[#F3E8D2] rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(totals.progressPercentage, 2)}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          {/* Journey Trail Milestones */}
          <div className="flex items-center justify-between mt-3 text-[10px] font-mono tracking-wider text-[#8E8B99]">
            <div className="flex flex-col items-start">
              <span className="text-[#F3E8D2] font-semibold">OCT 01</span>
              <span>Day 1</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[#E08A9B] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E08A9B] animate-ping" />
                TODAY
              </span>
              <span>On track</span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[#F6F4EE] font-semibold flex items-center gap-1">
                DEC 10
                <Plane className="w-3 h-3 text-[#E08A9B]" />
              </span>
              <span>Trip Time</span>
            </div>
          </div>
        </div>

        {/* Supporting Stats (Not KPI boxes, but warm inline tokens) */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#8E8B99] font-medium">Remaining to pack</span>
            <span className="text-base font-semibold text-[#F3E8D2]">
              ₹{formattedRemaining} to go
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[11px] text-[#8E8B99] font-medium flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#E08A9B]" /> Days completed
            </span>
            <span className="text-base font-semibold text-[#F6F4EE]">
              {totals.completedDaysCount} of {totals.totalDays} days
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
