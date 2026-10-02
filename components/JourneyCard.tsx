'use client';

import React from 'react';
import { Lock, Check, Plus, Edit2, AlertCircle } from 'lucide-react';
import { DayJourneyItem } from '@/types';

interface JourneyCardProps {
  item: DayJourneyItem;
  onSelectDate: (date: string) => void;
}

export function JourneyCard({ item, onSelectDate }: JourneyCardProps) {
  // If future date: locked and completely disabled
  if (item.isFuture) {
    return (
      <div className="relative flex items-center justify-between p-3.5 rounded-2xl bg-[#121319]/60 border border-white/[0.03] text-[#646270] select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#0E0F14] border border-white/[0.03] flex items-center justify-center">
            <Lock className="w-3.5 h-3.5 text-[#646270]" />
          </div>
          <div>
            <div className="text-xs font-mono font-medium text-[#646270]">
              {item.formattedDate}
            </div>
            <div className="text-[11px] text-[#646270]">Day {item.dayNumber}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#646270] font-mono">
          <span>Not yet</span>
        </div>
      </div>
    );
  }

  // Today's date card
  if (item.isToday) {
    return (
      <div className="relative flex items-center justify-between p-3.5 rounded-2xl bg-[#1C1D24] border border-[#E08A9B]/40 shadow-lg shadow-[#E08A9B]/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#E08A9B]/20 text-[#E08A9B] flex items-center justify-center font-bold text-xs">
            ★
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#F6F4EE]">
                {item.formattedDate}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[#E08A9B] text-[#0A0A0D] text-[9px] font-black uppercase tracking-wider">
                TODAY
              </span>
            </div>
            <div className="text-[11px] text-[#8E8B99] mt-0.5">
              {item.totalDayAmount > 0 ? (
                <span>
                  S: ₹{item.sreeramAmount} · N: ₹{item.niyaaAmount}
                </span>
              ) : (
                <span>Ready to save ₹100</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelectDate(item.date)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E08A9B] text-[#0A0A0D] hover:bg-[#E89AA8] text-xs font-bold transition-all active:scale-95 shadow-sm"
        >
          {item.totalDayAmount > 0 ? (
            <>
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Completed Past Date
  if (item.isComplete) {
    return (
      <div className="relative flex items-center justify-between p-3 rounded-2xl bg-[#16171D] border border-white/5 hover:border-white/10 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-[#E08A9B]/15 text-[#E08A9B] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-[#E08A9B]" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-xs font-mono font-medium text-[#F6F4EE]">
              {item.formattedDate}
            </div>
            <div className="text-[11px] text-[#8E8B99]">
              Sreeram ₹{item.sreeramAmount} · Niyaa ₹{item.niyaaAmount}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {item.bonusAmount > 0 && (
            <span className="text-[10px] font-mono text-[#F3E8D2] bg-[#101116] px-1.5 py-0.5 rounded border border-white/5">
              +₹{item.bonusAmount} bonus
            </span>
          )}
          <button
            onClick={() => onSelectDate(item.date)}
            className="text-[11px] text-[#8E8B99] hover:text-[#F6F4EE] px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            Saved ✓
          </button>
        </div>
      </div>
    );
  }

  // Partial Past Date
  if (item.status === 'partial') {
    return (
      <div className="relative flex items-center justify-between p-3 rounded-2xl bg-[#16171D] border border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-xs font-mono font-medium text-[#F6F4EE]">
              {item.formattedDate}
            </div>
            <div className="text-[11px] text-amber-300/80">
              ₹{item.baselineCounted} / ₹100 packed
            </div>
          </div>
        </div>

        <button
          onClick={() => onSelectDate(item.date)}
          className="text-xs font-semibold text-[#E08A9B] hover:text-[#F3E8D2] px-2.5 py-1 rounded-lg bg-[#E08A9B]/10 hover:bg-[#E08A9B]/20 transition-all"
        >
          Top up →
        </button>
      </div>
    );
  }

  // Missed Past Date
  return (
    <div className="relative flex items-center justify-between p-3 rounded-2xl bg-[#16171D] border border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-xl bg-[#101116] text-[#8E8B99] flex items-center justify-center shrink-0 border border-white/5">
          <span className="w-2 h-2 rounded-full border border-[#8E8B99]" />
        </div>
        <div>
          <div className="text-xs font-mono font-medium text-[#8E8B99]">
            {item.formattedDate}
          </div>
          <div className="text-[11px] text-[#8E8B99]/70">Missed day</div>
        </div>
      </div>

      <button
        onClick={() => onSelectDate(item.date)}
        className="text-xs font-semibold text-[#E08A9B] hover:text-[#F3E8D2] px-2.5 py-1 rounded-lg bg-[#E08A9B]/10 hover:bg-[#E08A9B]/20 transition-all"
      >
        Catch up →
      </button>
    </div>
  );
}
