'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface LoginFormProps {
  onLogin: (user: 'Ayberk' | 'Selvi') => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [user, setUser] = useState<'Ayberk' | 'Selvi'>('Ayberk');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if the password is correct for the selected user
    const correctPassword = user === 'Ayberk' 
      ? process.env.NEXT_PUBLIC_AYBERK_PASSWORD 
      : process.env.NEXT_PUBLIC_SELVI_PASSWORD;
    
    if (password === correctPassword) {
      // Password is correct, proceed with login
      onLogin(user);
      setError('');
    } else {
      // Password is incorrect, show custom error message
      setError('Neeeee unuttun mu ????');
      
      // Also show a toast notification with the same message
      toast.error('Neeeee unuttun mu ????', {
        icon: '😱',
        duration: 4000
      });
      
      // Shake the form to indicate error
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <motion.form
        animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Welcome to Our Memory Calendar
        </h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Who are you?
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setUser('Ayberk')}
              className={`flex-1 py-3 rounded-lg transition-colors ${
                user === 'Ayberk'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Ayberk
            </button>
            <button
              type="button"
              onClick={() => setUser('Selvi')}
              className={`flex-1 py-3 rounded-lg transition-colors ${
                user === 'Selvi'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Selvi
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
              focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter your password"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium 
            rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
        >
          Login
        </button>
      </motion.form>
    </motion.div>
  );
} 