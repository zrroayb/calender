'use client';

import { Heart, Calendar as CalendarIcon, User, Settings } from 'lucide-react';
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
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            currentUser === 'Ayberk' ? 'bg-purple-100 text-purple-600' : 'bg-pink-100 text-pink-600'
          }`}>
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">{currentUser}</span>
        </div>
      </div>
    </motion.div>
  );
} 