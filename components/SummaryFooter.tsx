'use client';

import React from 'react';
import { Heart, Sparkles, Plane } from 'lucide-react';
import { FundTotals } from '@/types';

interface SummaryFooterProps {
  totals: FundTotals;
  onOpenCelebration: () => void;
}

export function SummaryFooter({ totals, onOpenCelebration }: SummaryFooterProps) {
  const formattedSaved = new Intl.NumberFormat('en-IN').format(totals.mainFund);
  const formattedLeft = new Intl.NumberFormat('en-IN').format(totals.remainingAmount);
  const formattedBonus = new Intl.NumberFormat('en-IN').format(totals.bonusFund);

  return (
    <footer className="px-5 pt-4 pb-28 text-center">
      {/* Scrapbook Summary Chips */}
      <div className="bg-[#16171D] rounded-3xl p-5 border border-white/5 mb-6 text-left">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E08A9B]" />
          <span className="text-[10px] font-bold tracking-widest text-[#8E8B99] uppercase">
            JOURNAL SUMMARY
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex flex-col">
            <span className="text-[#8E8B99]">Main Fund Saved</span>
            <span className="text-base font-bold text-[#F6F4EE] font-mono">
              ₹{formattedSaved}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#8E8B99]">Still Left</span>
            <span className="text-base font-bold text-[#F3E8D2] font-mono">
              ₹{formattedLeft}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#8E8B99]">Bonus Stash</span>
            <span className="text-base font-bold text-[#E08A9B] font-mono">
              ₹{formattedBonus}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[#8E8B99]">Days Packed</span>
            <span className="text-base font-bold text-[#F6F4EE] font-mono">
              {totals.completedDaysCount} / {totals.totalDays}
            </span>
          </div>
        </div>

        {totals.isCompleted && (
          <div className="mt-4 pt-3 border-t border-white/5">
            <button
              onClick={onOpenCelebration}
              className="w-full py-2.5 px-3 rounded-xl bg-[#E08A9B]/15 hover:bg-[#E08A9B]/25 text-[#E08A9B] border border-[#E08A9B]/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>View Unlocked Vacation Trip ✈️</span>
            </button>
          </div>
        )}
      </div>

      {/* Romantic Closing Passport Stamp */}
      <div className="flex flex-col items-center justify-center gap-2 text-[#8E8B99] text-xs">
        <div className="passport-stamp text-[10px] font-mono text-[#F3E8D2]/70">
          <Plane className="w-3 h-3 text-[#E08A9B]" />
          <span>SREERAM × NIYAA · DEC 10, 2026</span>
        </div>

        <p className="font-handwriting text-base text-[#F3E8D2]/80 mt-1">
          Two tickets, one Christmas, endless memories.
        </p>

        <p className="text-[10px] text-[#646270]">
          Private shared journal · All savings tracked with love ❤️
        </p>
      </div>
    </footer>
  );
}
