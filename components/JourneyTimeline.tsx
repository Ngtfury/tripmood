'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { DayJourneyItem } from '@/types';
import { JourneyCard } from './JourneyCard';

interface JourneyTimelineProps {
  items: DayJourneyItem[];
  onSelectDate: (date: string) => void;
}

export function JourneyTimeline({ items, onSelectDate }: JourneyTimelineProps) {
  // Group days by month: "10" -> October, "11" -> November, "12" -> December
  const octoberDays = items.filter((item) => item.date.startsWith('2026-10'));
  const novemberDays = items.filter((item) => item.date.startsWith('2026-11'));
  const decemberDays = items.filter((item) => item.date.startsWith('2026-12'));

  // Collapsible state (October open by default)
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({
    '10': true,
    '11': false,
    '12': false,
  });

  const toggleMonth = (monthKey: string) => {
    setOpenMonths((prev) => ({
      ...prev,
      [monthKey]: !prev[monthKey],
    }));
  };

  const getMonthStats = (days: DayJourneyItem[]) => {
    const completed = days.filter((d) => d.isComplete).length;
    return { completed, total: days.length };
  };

  const renderMonthSection = (
    monthKey: string,
    monthTitle: string,
    days: DayJourneyItem[]
  ) => {
    const isOpen = openMonths[monthKey];
    const stats = getMonthStats(days);

    return (
      <div key={monthKey} className="mb-4">
        {/* Month Accordion Header */}
        <button
          onClick={() => toggleMonth(monthKey)}
          className="w-full flex items-center justify-between py-3 px-4 rounded-2xl bg-[#16171D] border border-white/5 text-left mb-2 transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#E08A9B]" />
            <span className="text-xs font-bold tracking-widest text-[#F6F4EE] uppercase">
              {monthTitle}
            </span>
            <span className="text-[11px] font-mono text-[#8E8B99] ml-1">
              ({days.length} days)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#F3E8D2] bg-[#101116] px-2 py-0.5 rounded-full border border-white/5">
              {stats.completed}/{stats.total} packed
            </span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-[#8E8B99]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#8E8B99]" />
            )}
          </div>
        </button>

        {/* Days List with vertical route line */}
        {isOpen && (
          <div className="relative pl-3 ml-2 border-l border-white/10 space-y-2 py-1">
            {days.map((item) => (
              <JourneyCard
                key={item.date}
                item={item}
                onSelectDate={onSelectDate}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="px-5 my-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#E08A9B]" />
          <h2 className="text-[11px] font-bold tracking-widest text-[#8E8B99] uppercase">
            OUR SAVING JOURNEY
          </h2>
        </div>
        <span className="text-xs font-handwriting text-[#F3E8D2]">
          71 days together
        </span>
      </div>

      {renderMonthSection('10', 'October 2026', octoberDays)}
      {renderMonthSection('11', 'November 2026', novemberDays)}
      {renderMonthSection('12', 'December 2026', decemberDays)}
    </section>
  );
}
