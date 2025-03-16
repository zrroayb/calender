'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface LoveHeartProps {
  currentUser: 'Ayberk' | 'Selvi';
}

export default function LoveHeart({ currentUser }: LoveHeartProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
    console.log('LoveHeart mounted for user:', currentUser);
  }, [currentUser]);
  
  const handleHeartClick = async () => {
    // Start animation
    setIsAnimating(true);
    console.log('Heart clicked by user:', currentUser);
    
    try {
      // Send love message via API
      const response = await fetch('/api/send-love', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: currentUser
        }),
      });
      
      const data = await response.json();
      
      // Determine recipient based on sender
      const recipient = currentUser === 'Ayberk' ? 'Selvi' : 'Ayberk';
      
      if (data.success) {
        toast.success(`Love message sent to ${recipient}!`, {
          icon: '❤️',
          duration: 3000,
        });
      } else {
        console.error('Failed to send love message:', data);
        toast.error(`Couldn't send love message to ${recipient}. Try again?`);
      }
    } catch (error) {
      console.error('Error sending love message:', error);
      toast.error('Something went wrong. Try again?');
    } finally {
      // End animation after a delay
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };
  
  if (!mounted) return null;
  
  return (
    <div className="fixed left-6 bottom-24 z-50">
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isAnimating ? {
            scale: [1, 1.5, 1],
            rotate: [0, 15, -15, 0],
            transition: { duration: 1 }
          } : {
            scale: [1, 1.05, 1],
            transition: { 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut" 
            }
          }}
          className="cursor-pointer bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg"
          onClick={handleHeartClick}
        >
          <Heart 
            size={56} 
            fill="#ff2d55" 
            color="#ff2d55" 
            strokeWidth={1.5}
            className="filter drop-shadow-lg"
          />
        </motion.div>
        
        {/* Add a small indicator to show it's clickable */}
        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          ♥
        </div>
      </div>
    </div>
  );
} 