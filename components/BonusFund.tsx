'use client';

import React from 'react';
import { Sparkles, Gift } from 'lucide-react';
import { FundTotals } from '@/types';

interface BonusFundProps {
  totals: FundTotals;
}

export function BonusFund({ totals }: BonusFundProps) {
  const formattedBonus = new Intl.NumberFormat('en-IN').format(totals.bonusFund);

  return (
    <section className="px-5 my-4">
      <div className="bg-[#16171D] rounded-3xl p-5 border border-white/5 shadow-xl relative overflow-hidden">
        {/* Subtle decorative stamp texture */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F3E8D2]" />
            <span className="text-[11px] font-bold tracking-widest text-[#8E8B99] uppercase">
              A LITTLE EXTRA
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-[#F3E8D2] bg-[#101116] px-2.5 py-0.5 rounded-full border border-white/5">
            <Gift className="w-3 h-3 text-[#E08A9B]" />
            <span>Bonus Treats</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-3xl font-extrabold text-[#F6F4EE] tracking-tight">
            ₹{formattedBonus}
          </span>
          <span className="text-xs text-[#8E8B99] font-medium">
            extra saved
          </span>
        </div>

        <p className="text-xs text-[#8E8B99] leading-relaxed mb-4">
          Money we saved beyond our ₹100 daily plan. Never counted against our ₹7,100 baseline, this is saved for cozy dinners, holiday treats, and spontaneous memories!
        </p>

        {/* Scrapbook Stamp Badges for Bonus */}
        <div className="flex items-center gap-2 flex-wrap">
          {totals.bonusFund > 0 ? (
            <>
              <div className="passport-stamp text-[10px] text-[#F3E8D2] font-mono bg-[#101116]/80">
                <Sparkles className="w-2.5 h-2.5 text-[#E08A9B]" />
                <span>+BONUS STASH</span>
              </div>
              <div className="px-3 py-1 rounded-xl bg-[#101116] border border-white/5 text-[11px] text-[#8E8B99] font-medium">
                Dinner & Sweets Fund 🥂
              </div>
            </>
          ) : (
            <div className="text-xs text-[#8E8B99] italic">
              Any daily contribution above ₹50/person automatically saves here.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
