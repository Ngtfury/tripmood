'use client';

import React, { useState } from 'react';
import { Wifi, WifiOff, CloudCheck } from 'lucide-react';

interface OfflineSyncBadgeProps {
  isOnline: boolean;
  isSupabaseLive: boolean;
  pendingSyncCount: number;
}

export function OfflineSyncBadge({
  isOnline,
  isSupabaseLive,
  pendingSyncCount,
}: OfflineSyncBadgeProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16171D] border border-white/5 text-[11px] font-medium text-[#8E8B99] hover:text-[#F6F4EE] transition-all"
        title="Sync status"
      >
        {!isOnline ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
            <WifiOff className="w-3 h-3 text-amber-400" />
            <span>Offline</span>
          </>
        ) : isSupabaseLive ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E08A9B] animate-pulse" />
            <Wifi className="w-3 h-3 text-[#E08A9B]" />
            <span>Shared Live</span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F3E8D2]/60" />
            <CloudCheck className="w-3 h-3 text-[#F3E8D2]/80" />
            <span>Journal Ready</span>
          </>
        )}

        {pendingSyncCount > 0 && (
          <span className="ml-0.5 px-1 py-0.2 bg-[#E08A9B]/20 text-[#E08A9B] rounded-full text-[9px] font-bold">
            {pendingSyncCount}
          </span>
        )}
      </button>

      {showDetails && (
        <div
          onClick={() => setShowDetails(false)}
          className="absolute right-0 top-full mt-2 w-64 p-3 bg-[#1C1D24] border border-white/10 rounded-xl shadow-2xl text-xs text-[#8E8B99] z-40 backdrop-blur-md"
        >
          <div className="font-medium text-[#F6F4EE] mb-1">Shared Journal Sync</div>
          <p className="leading-relaxed">
            {!isOnline
              ? 'You are offline. Your savings entries are stored safely on this device and will sync when reconnected.'
              : isSupabaseLive
              ? 'Connected to live Supabase backend. Both Sreeram and Niyaa can see savings update in real time.'
              : 'Local storage active. Add your Supabase credentials in .env.local to enable multi-device live sync.'}
          </p>
        </div>
      )}
    </div>
  );
}
