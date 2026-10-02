'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Check, Calendar, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEffects } from '@/lib/audio';
import { IOSSpinner } from './IOSSpinner';
import { calculateDailyBreakdown, validatePersonAmount } from '@/lib/calculations';
import { formatFriendlyDate, getTodayInTimezone, isDateInFuture, isDateWithinTripRange } from '@/lib/dates';
import { DailyContribution } from '@/types';
import { TRIP_CONFIG } from '@/lib/constants';

interface ContributionSheetProps {
  isOpen: boolean;
  selectedDate: string;
  existingContribution?: DailyContribution;
  todayDate: string;
  onClose: () => void;
  onSave: (payload: { date: string; sreeram: number; niyaa: number; notes?: string }) => Promise<void>;
  validDates: { date: string; label: string }[];
}

export function ContributionSheet({
  isOpen,
  selectedDate,
  existingContribution,
  todayDate,
  onClose,
  onSave,
  validDates,
}: ContributionSheetProps) {
  const [activeDate, setActiveDate] = useState(selectedDate || todayDate);
  const [sreeramAmount, setSreeramAmount] = useState<number>(existingContribution?.sreeram_amount ?? 50);
  const [niyaaAmount, setNiyaaAmount] = useState<number>(existingContribution?.niyaa_amount ?? 50);
  const [notes, setNotes] = useState<string>(existingContribution?.notes ?? '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  // Sync state whenever modal opens or selectedDate changes
  useEffect(() => {
    if (isOpen) {
      const targetDate = selectedDate || todayDate;
      setActiveDate(targetDate);
      setSreeramAmount(existingContribution?.sreeram_amount ?? 50);
      setNiyaaAmount(existingContribution?.niyaa_amount ?? 50);
      setNotes(existingContribution?.notes ?? '');
      setErrorMessage(null);
      setIsSubmitting(false);
      setIsSavedSuccess(false);
    }
  }, [isOpen, selectedDate, existingContribution, todayDate]);

  // Live breakdown calculation
  const breakdown = calculateDailyBreakdown(sreeramAmount, niyaaAmount);

  const handleSave = async () => {
    setErrorMessage(null);

    // 1. Date validation
    if (!isDateWithinTripRange(activeDate)) {
      setErrorMessage(`Please select a date between Oct 1 and Dec 10.`);
      return;
    }

    if (isDateInFuture(activeDate, TRIP_CONFIG.timezone)) {
      setErrorMessage("That day hasn't happened yet ✦");
      return;
    }

    // 2. Amount validations
    const sCheck = validatePersonAmount(sreeramAmount);
    if (!sCheck.valid) {
      setErrorMessage(sCheck.error || 'Invalid amount for Sreeram');
      return;
    }

    const nCheck = validatePersonAmount(niyaaAmount);
    if (!nCheck.valid) {
      setErrorMessage(nCheck.error || 'Invalid amount for Niyaa');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        date: activeDate,
        sreeram: sreeramAmount,
        niyaa: niyaaAmount,
        notes,
      });

      // Ring cute satisfaction bell chime! 🔔✨
      soundEffects.playCuteBellRing();

      // Confetti burst for satisfaction
      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#E08A9B', '#F3E8D2', '#FFD700', '#F6F4EE'],
        });
      } catch {
        // ignore confetti errors if any
      }

      setIsSavedSuccess(true);

      // Brief pause to allow user to savor the chime and visual confirmation
      setTimeout(() => {
        setIsSavedSuccess(false);
        setIsSubmitting(false);
        onClose();
      }, 750);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "That didn't save. Try again?";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  const presetAmounts = [0, 50, 100, 150];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* iOS Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#16171D] rounded-t-[32px] border-t border-white/10 p-6 safe-bottom shadow-2xl z-10 max-h-[92vh] overflow-y-auto"
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            {/* Header with Date & Close */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#E08A9B] uppercase font-bold">
                  {activeDate === todayDate ? '★ TODAY · ' : ''}
                  {formatFriendlyDate(activeDate)}
                </span>
                <h3 className="text-lg font-bold text-[#F6F4EE]">
                  {existingContribution ? 'Edit Day’s Savings' : 'Add to Our Trip Fund'}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1C1D24] border border-white/5 flex items-center justify-center text-[#8E8B99] hover:text-[#F6F4EE]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Date Selector (Only allows Oct 1 to Today) */}
            <div className="mb-5 bg-[#101116] p-3 rounded-2xl border border-white/5">
              <label className="text-xs text-[#8E8B99] flex items-center gap-1.5 mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#E08A9B]" />
                <span>Date for this savings entry</span>
              </label>
              <select
                value={activeDate}
                onChange={(e) => setActiveDate(e.target.value)}
                className="w-full bg-[#16171D] text-[#F6F4EE] text-sm font-mono p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-[#E08A9B]"
              >
                {validDates.map((d) => (
                  <option key={d.date} value={d.date}>
                    {d.label} {d.date === todayDate ? '(Today)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Sreeram Contribution */}
            <div className="mb-5 bg-[#101116] p-4 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#F6F4EE]">Sreeram</span>
                <span className="text-base font-extrabold text-[#E08A9B] font-mono">
                  ₹{sreeramAmount}
                </span>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSreeramAmount(amt)}
                    className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                      sreeramAmount === amt
                        ? 'bg-[#E08A9B] text-[#0A0A0D] border-[#E08A9B]'
                        : 'bg-[#16171D] text-[#8E8B99] border-white/5 hover:text-[#F6F4EE]'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-[#8E8B99]">₹</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={sreeramAmount === 0 ? '' : sreeramAmount}
                  placeholder="0 or 50+"
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                    setSreeramAmount(isNaN(val) ? 0 : val);
                  }}
                  className="w-full bg-[#16171D] text-[#F6F4EE] text-sm pl-7 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#E08A9B]"
                />
              </div>
            </div>

            {/* Niyaa Contribution */}
            <div className="mb-5 bg-[#101116] p-4 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-[#F6F4EE]">Niyaa</span>
                <span className="text-base font-extrabold text-[#E08A9B] font-mono">
                  ₹{niyaaAmount}
                </span>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setNiyaaAmount(amt)}
                    className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                      niyaaAmount === amt
                        ? 'bg-[#E08A9B] text-[#0A0A0D] border-[#E08A9B]'
                        : 'bg-[#16171D] text-[#8E8B99] border-white/5 hover:text-[#F6F4EE]'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm text-[#8E8B99]">₹</span>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={niyaaAmount === 0 ? '' : niyaaAmount}
                  placeholder="0 or 50+"
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                    setNiyaaAmount(isNaN(val) ? 0 : val);
                  }}
                  className="w-full bg-[#16171D] text-[#F6F4EE] text-sm pl-7 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-[#E08A9B]"
                />
              </div>
            </div>

            {/* Live Breakdown Summary */}
            <div className="mb-6 p-4 rounded-2xl bg-[#1C1D24] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#8E8B99]">Total Saved Today</span>
                <span className="text-sm font-bold text-[#F6F4EE] font-mono">
                  ₹{breakdown.totalDayAmount}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
                <div>
                  <span className="text-[#8E8B99]">Counts to Trip Fund:</span>
                  <div className="font-semibold text-[#F3E8D2]">
                    ₹{breakdown.baselineCounted} / ₹100
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[#8E8B99]">Goes to Bonus Stash:</span>
                  <div className="font-semibold text-[#E08A9B]">
                    +₹{breakdown.bonusAmount} extra
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-[#E08A9B]/40 text-xs text-[#E08A9B] text-center font-medium">
                {errorMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting || isSavedSuccess}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg disabled:opacity-90 ${
                  isSavedSuccess
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30 scale-[1.02]'
                    : 'bg-[#E08A9B] hover:bg-[#E89AA8] text-[#0A0A0D] shadow-[#E08A9B]/20'
                }`}
              >
                {isSavedSuccess ? (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.9, 1.1, 1] }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-5 h-5 stroke-[3] text-white" />
                    <span>Saved with Love! 🔔❤️</span>
                  </motion.div>
                ) : isSubmitting ? (
                  <div className="flex items-center gap-2.5">
                    <IOSSpinner size={18} color="#0A0A0D" />
                    <span className="font-semibold">Saving to Journal...</span>
                  </div>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-[#0A0A0D]" />
                    <span>Save to Journal</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full py-2.5 text-xs text-[#8E8B99] hover:text-[#F6F4EE] transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
