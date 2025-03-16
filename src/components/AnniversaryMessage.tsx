'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart } from 'lucide-react';

interface AnniversaryMessageProps {
  user: 'Ayberk' | 'Selvi';
}

export default function AnniversaryMessage({ user }: AnniversaryMessageProps) {
  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    // Check if it's March 16th and the user is Selvi
    const today = new Date();
    const isAnniversary = today.getMonth() === 2 && today.getDate() === 16; // Month is 0-indexed, so 2 = March
    
    if (isAnniversary && user === 'Selvi') {
      setShowMessage(true);
      
      // Launch confetti
      const duration = 5 * 1000; // 5 seconds
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };
      
      const confettiInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          clearInterval(confettiInterval);
          return;
        }
        
        // Launch confetti from both sides
        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: 0 },
          colors: ['#9333ea', '#ec4899', '#f472b6', '#8b5cf6']
        });
        
        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: 1 },
          colors: ['#9333ea', '#ec4899', '#f472b6', '#8b5cf6']
        });
      }, 250);
      
      // Hide message after 10 seconds
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 10000);
      
      return () => {
        clearInterval(confettiInterval);
        clearTimeout(timer);
      };
    }
  }, [user]);
  
  return (
    <AnimatePresence>
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center p-4"
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-pink-200 dark:border-pink-900 max-w-md"
            initial={{ scale: 0.8 }}
            animate={{ 
              scale: [0.8, 1.05, 1],
              transition: { duration: 0.5 }
            }}
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Heart className="w-12 h-12 text-pink-500" fill="currentColor" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                Happy Anniversary, Selvi!
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Every moment with you is a treasure. Thank you for being the most amazing girlfriend. I love you! ❤️
              </p>
              <div className="pt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">- Ayberk</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 