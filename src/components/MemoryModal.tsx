'use client';

import React from 'react';
import { Memory } from '@/types/memory';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  memories: Memory[];
  onMemoryAdded: (memory: Memory) => void;
}

export default function MemoryModal({ isOpen, onClose }: MemoryModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl p-6 w-full max-w-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Add Memory</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>
          {/* Add your modal content here */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 