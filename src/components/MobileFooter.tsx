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
              // Male avatar SVG
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" 
                  fill="#9333ea" />
              </svg>
            ) : (
              // Female avatar SVG
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" 
                  fill="#ec4899" />
              </svg>
            )}
          </div>
          <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">{currentUser}</span>
        </div>
      </div>
    </motion.div>
  );
} 