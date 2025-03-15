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
  color: string;
}

export default function FallingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const colors = [
      'text-pink-400',
      'text-rose-400',
      'text-purple-400',
      'text-fuchsia-400'
    ];

    const createHeart = () => ({
      id: Math.random(),
      x: Math.random() * 100,
      delay: Math.random() * 2,
      scale: 0.8 + Math.random() * 0.7, // Bigger hearts
      opacity: 0.5 + Math.random() * 0.3, // More visible opacity
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    // Create initial hearts
    setHearts(Array.from({ length: 20 }, createHeart)); // More hearts

    // Add new hearts more frequently
    const interval = setInterval(() => {
      setHearts(prev => [...prev.slice(-19), createHeart()]);
    }, 2000); // Faster interval

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
            opacity: 0,
            rotate: -30 + Math.random() * 60, // Random rotation
          }}
          animate={{ 
            y: '110vh',
            opacity: heart.opacity,
            rotate: 30 + Math.random() * 60, // Rotate while falling
          }}
          transition={{ 
            duration: 15, // Slower fall
            delay: heart.delay,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1], // Custom easing for more natural movement
          }}
          className="absolute top-0"
        >
          <Heart 
            className={`${heart.color} drop-shadow-lg filter blur-[0.2px]`} // Added shadow and slight blur
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