'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Heart {
  id: number;
  x: number;
  delay: number;
  scale: number;
  opacity: number;
}

export default function FallingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const createHeart = () => ({
      id: Math.random(),
      x: Math.random() * 100, // random position across screen width
      delay: Math.random() * 2, // random start delay
      scale: 0.5 + Math.random() * 0.5, // random size
      opacity: 0.3 + Math.random() * 0.4, // random opacity
    });

    // Create initial hearts
    setHearts(Array.from({ length: 15 }, createHeart));

    // Add new hearts periodically
    const interval = setInterval(() => {
      setHearts(prev => [...prev.slice(-14), createHeart()]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ 
            y: -20,
            x: `${heart.x}vw`,
            opacity: 0 
          }}
          animate={{ 
            y: '110vh',
            opacity: heart.opacity,
          }}
          transition={{ 
            duration: 10,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute top-0"
        >
          <Heart 
            className="text-pink-400/30 dark:text-pink-500/20" 
            style={{ 
              transform: `scale(${heart.scale})`,
            }}
            fill="currentColor"
          />
        </motion.div>
      ))}
    </div>
  );
} 