'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '@/types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function Toast({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed top-4 inset-x-0 z-50 flex flex-col items-center gap-2 pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl max-w-sm w-full border backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-[#1C1318]/95 border-[#E08A9B]/40 text-[#F6F4EE]'
                : toast.type === 'success'
                ? 'bg-[#16171D]/95 border-[#E08A9B]/30 text-[#F6F4EE]'
                : 'bg-[#16171D]/95 border-white/10 text-[#F6F4EE]'
            }`}
          >
            {toast.type === 'success' ? (
              <Heart className="w-4 h-4 text-[#E08A9B] fill-[#E08A9B] shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-[#E08A9B] shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#F3E8D2] shrink-0" />
            )}
            <p className="text-sm font-medium flex-1 text-left">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-full text-[#8E8B99] hover:text-[#F6F4EE] transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
