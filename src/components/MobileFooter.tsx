'use client';

import { Heart, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileFooterProps {
  currentUser: 'Ayberk' | 'Selvi';
}

export default function MobileFooter({ currentUser }: MobileFooterProps) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4 z-40"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <CalendarIcon className="w-6 h-6 text-purple-500" />
          <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">Calendar</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative">
            <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
            <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              ∞
            </span>
          </div>
          <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">Memories</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full overflow-hidden border-2 flex items-center justify-center ${
            currentUser === 'Ayberk' ? 'border-purple-500 bg-purple-100' : 'border-pink-500 bg-pink-100'
          }`}>
            {currentUser === 'Ayberk' ? (
              // Male pixel art avatar
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="4" width="8" height="4" fill="#9333ea" />
                <rect x="4" y="8" width="4" height="4" fill="#9333ea" />
                <rect x="16" y="8" width="4" height="4" fill="#9333ea" />
                <rect x="4" y="12" width="16" height="4" fill="#9333ea" />
                <rect x="8" y="16" width="8" height="4" fill="#9333ea" />
              </svg>
            ) : (
              // Female pixel art avatar
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="4" width="8" height="4" fill="#ec4899" />
                <rect x="4" y="8" width="4" height="4" fill="#ec4899" />
                <rect x="16" y="8" width="4" height="4" fill="#ec4899" />
                <rect x="4" y="12" width="16" height="4" fill="#ec4899" />
                <rect x="4" y="16" width="4" height="4" fill="#ec4899" />
                <rect x="16" y="16" width="4" height="4" fill="#ec4899" />
              </svg>
            )}
          </div>
          <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">{currentUser}</span>
        </div>
      </div>
    </motion.div>
  );
} 