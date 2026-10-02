'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Plane, Sparkles, X, Luggage } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TripCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalSaved: number;
  bonusAmount: number;
}

export function TripCompleteModal({
  isOpen,
  onClose,
  totalSaved,
  bonusAmount,
}: TripCompleteModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire romantic confetti burst: cream, rose, gold
      const colors = ['#E08A9B', '#F3E8D2', '#D47788', '#F6F4EE'];

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });

      const timeout = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Celebration Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="relative w-full max-w-sm bg-[#16171D] rounded-3xl p-6 border border-[#E08A9B]/40 shadow-2xl text-center z-10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#101116] border border-white/5 flex items-center justify-center text-[#8E8B99] hover:text-[#F6F4EE]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Floating Airplane Animation */}
            <div className="flex justify-center mb-4 mt-2">
              <motion.div
                animate={{
                  y: [-3, 3, -3],
                  rotate: [-2, 2, -2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut',
                }}
                className="w-16 h-16 rounded-3xl bg-[#1C1D24] border border-[#E08A9B]/40 flex items-center justify-center relative shadow-xl shadow-[#E08A9B]/10"
              >
                <Plane className="w-8 h-8 text-[#E08A9B]" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#E08A9B] flex items-center justify-center"
                >
                  <Heart className="w-3 h-3 text-[#0A0A0D] fill-[#0A0A0D]" />
                </motion.div>
              </motion.div>
            </div>

            {/* Header Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E08A9B]/15 border border-[#E08A9B]/30 mb-3">
              <Sparkles className="w-3 h-3 text-[#E08A9B]" />
              <span className="text-[10px] font-bold tracking-widest text-[#E08A9B] uppercase">
                TRIP FUND COMPLETE
              </span>
            </div>

            {/* Target saved text */}
            <h2 className="text-3xl font-extrabold text-[#F6F4EE] tracking-tight mb-1">
              ₹7,100 saved ❤️
            </h2>

            <p className="text-sm font-semibold text-[#F3E8D2] mb-1">
              Sreeram × Niyaa
            </p>

            <p className="text-xs text-[#8E8B99] uppercase tracking-wider mb-5">
              Christmas Vacation Trip Unlocked
            </p>

            {/* Stats Breakdown Box */}
            <div className="bg-[#101116] rounded-2xl p-4 border border-white/5 mb-5 text-left text-xs space-y-2">
              <div className="flex justify-between text-[#8E8B99]">
                <span>Main Trip Target:</span>
                <span className="text-[#F6F4EE] font-mono font-bold">₹7,100 / ₹7,100</span>
              </div>
              {bonusAmount > 0 && (
                <div className="flex justify-between text-[#8E8B99]">
                  <span>Bonus Treats Stash:</span>
                  <span className="text-[#E08A9B] font-mono font-bold">+₹{bonusAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-[#8E8B99] pt-2 border-t border-white/5">
                <span>Total Put Away:</span>
                <span className="text-[#F3E8D2] font-mono font-bold">₹{totalSaved}</span>
              </div>
            </div>

            {/* Romantic Closing Quote */}
            <div className="mb-6">
              <p className="font-handwriting text-xl text-[#F3E8D2]/95">
                “Now all that&apos;s left is the trip.”
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#E08A9B] hover:bg-[#E89AA8] text-[#0A0A0D] font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-[#E08A9B]/20"
            >
              Back to Journal
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
