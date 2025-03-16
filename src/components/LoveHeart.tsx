'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { TELEGRAM_CONFIG, getChatId } from '@/utils/telegramConfig';

interface LoveHeartProps {
  currentUser: 'Ayberk' | 'Selvi';
}

export default function LoveHeart({ currentUser }: LoveHeartProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleHeartClick = async () => {
    // Start animation
    setIsAnimating(true);
    
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
  
  return (
    <div className="fixed left-4 bottom-24 z-40 md:left-6 md:bottom-6">
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isAnimating ? {
          scale: [1, 1.5, 1],
          rotate: [0, 15, -15, 0],
          transition: { duration: 1 }
        } : {}}
        className="cursor-pointer"
        onClick={handleHeartClick}
      >
        <Heart 
          size={48} 
          fill="#ff2d55" 
          color="#ff2d55" 
          strokeWidth={1.5}
          className="filter drop-shadow-lg"
        />
      </motion.div>
    </div>
  );
} 