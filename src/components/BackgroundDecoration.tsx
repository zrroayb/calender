'use client';

import { motion } from 'framer-motion';

export default function BackgroundDecoration() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Full page background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fafafa] to-[#f3f4f6] dark:from-gray-900 dark:to-gray-800" />
      
      {/* Top-left decoration */}
      <motion.div 
        className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      
      {/* Bottom-right decoration */}
      <motion.div 
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-tl from-pink-500/20 to-transparent rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      
      {/* Mobile-specific decorations */}
      <motion.div 
        className="md:hidden absolute bottom-20 left-0 w-full h-64 bg-gradient-to-t from-purple-500/10 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />
      
      {/* Desktop corner decorations */}
      <motion.div 
        className="hidden md:block absolute top-1/4 right-0 w-64 h-96 bg-gradient-to-l from-pink-500/10 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.6 }}
      />
      <motion.div 
        className="hidden md:block absolute bottom-1/4 left-0 w-64 h-96 bg-gradient-to-r from-purple-500/10 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.9 }}
      />
      
      {/* Additional corner fills */}
      <motion.div 
        className="absolute top-0 right-0 w-full h-64 bg-gradient-to-b from-purple-500/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-pink-500/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
      />
    </div>
  );
} 