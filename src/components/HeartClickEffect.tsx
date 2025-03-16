'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface HeartProps {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function HeartClickEffect() {
  const [hearts, setHearts] = useState<HeartProps[]>([]);
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Get the element that was clicked
      const target = e.target as HTMLElement;
      
      // Check if the click was on the calendar or a button or input
      const isCalendarClick = target.closest('.calendar-grid') !== null;
      const isInteractiveElement = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'A' ||
        target.closest('button') !== null;
      
      // Only create hearts if clicking on empty space
      if (!isCalendarClick && !isInteractiveElement) {
        const colors = ['#ec4899', '#9333ea', '#f472b6', '#d946ef'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomSize = Math.floor(Math.random() * 20) + 15; // 15-35px
        
        const newHeart: HeartProps = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
          size: randomSize,
          color: randomColor
        };
        
        setHearts(prev => [...prev, newHeart]);
        
        // Remove heart after animation
        setTimeout(() => {
          setHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
        }, 1000);
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.div
            key={heart.id}
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: heart.x - heart.size / 2, 
              y: heart.y - heart.size / 2 
            }}
            animate={{ 
              opacity: 0,
              scale: 1.5,
              y: heart.y - 100,
              rotate: Math.random() * 90 - 45
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ 
              position: 'absolute',
              width: heart.size,
              height: heart.size,
              color: heart.color
            }}
          >
            <Heart fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 