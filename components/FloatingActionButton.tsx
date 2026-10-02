'use client';

import React from 'react';
import { Plus, Heart } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  todayPacked: boolean;
}

export function FloatingActionButton({
  onClick,
  todayPacked,
}: FloatingActionButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        aria-label="Add or edit trip savings"
        className="group relative flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-[#1C1D24] hover:bg-[#252630] border border-[#E08A9B]/40 shadow-2xl shadow-black/80 transition-all active:scale-95 text-[#F6F4EE]"
      >
        {/* Ticket Perforation Notch */}
        <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#0A0A0D]" />

        <div className="w-7 h-7 rounded-full bg-[#E08A9B] flex items-center justify-center text-[#0A0A0D]">
          {todayPacked ? (
            <Heart className="w-3.5 h-3.5 fill-[#0A0A0D]" />
          ) : (
            <Plus className="w-4 h-4 stroke-[3]" />
          )}
        </div>

        <div className="flex flex-col text-left">
          <span className="text-xs font-bold tracking-wide text-[#F6F4EE]">
            {todayPacked ? 'Edit Today' : '+ Pack Today'}
          </span>
          <span className="text-[9px] font-mono text-[#E08A9B]">
            {todayPacked ? '₹100 packed' : '₹50/each'}
          </span>
        </div>
      </button>
    </div>
  );
}
