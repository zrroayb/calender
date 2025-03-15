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
  bounce: number;
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
      scale: 0.8 + Math.random() * 0.7,
      opacity: 0.5 + Math.random() * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      bounce: 1 + Math.random() * 2, // Random bounce height
    });

    setHearts(Array.from({ length: 20 }, createHeart));

    const interval = setInterval(() => {
      setHearts(prev => [...prev.slice(-19), createHeart()]);
    }, 2000);

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
            rotate: -30 + Math.random() * 60,
          }}
          animate={{ 
            y: [
              '-5vh', // Start position
              '30vh', // First bounce point
              `${15 + heart.bounce * 5}vh`, // Bounce up
              '60vh', // Second bounce point
              `${45 + heart.bounce * 3}vh`, // Smaller bounce up
              '110vh', // Final position
            ],
            x: [
              `${heart.x}vw`,
              `${heart.x + (Math.random() - 0.5) * 10}vw`, // Slight horizontal movement
              `${heart.x + (Math.random() - 0.5) * 15}vw`,
              `${heart.x + (Math.random() - 0.5) * 20}vw`,
              `${heart.x + (Math.random() - 0.5) * 25}vw`,
              `${heart.x + (Math.random() - 0.5) * 30}vw`,
            ],
            opacity: [0, heart.opacity, heart.opacity, heart.opacity * 0.8, heart.opacity * 0.6, 0],
            rotate: [
              -30 + Math.random() * 60,
              30 + Math.random() * 60,
              -45 + Math.random() * 90,
              45 + Math.random() * 90,
              -60 + Math.random() * 120,
              60 + Math.random() * 120,
            ],
            scale: [
              heart.scale,
              heart.scale * 1.1,
              heart.scale * 0.9,
              heart.scale * 1.05,
              heart.scale * 0.85,
              heart.scale * 0.7,
            ]
          }}
          transition={{ 
            duration: 15,
            delay: heart.delay,
            repeat: Infinity,
            ease: [0.76, 0, 0.24, 1], // More natural bouncy easing
            y: {
              times: [0, 0.3, 0.4, 0.6, 0.7, 1],
              ease: "easeInOut"
            },
            opacity: {
              times: [0, 0.1, 0.4, 0.6, 0.8, 1]
            },
            rotate: {
              times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              ease: "easeInOut"
            }
          }}
          className="absolute top-0"
        >
          <Heart 
            className={`${heart.color} drop-shadow-lg filter blur-[0.2px] transition-transform`}
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