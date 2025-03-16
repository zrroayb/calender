'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: 'Ayberk' | 'Selvi') => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedUser, setSelectedUser] = useState<'Ayberk' | 'Selvi' | null>(null);
  const [password, setPassword] = useState('');

  const handleLogin = (user: 'Ayberk' | 'Selvi') => {
    if (!user) return;
    
    console.log('LoginScreen: User selected:', user);
    
    // Check password
    const correctPassword = user === 'Ayberk' ? 'selvi' : 'ayberk';
    
    if (password.toLowerCase() !== correctPassword) {
      console.error('LoginScreen: Incorrect password');
      alert('Incorrect password');
      return;
    }
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem('currentUser', user);
      console.log('LoginScreen: Saved user to localStorage:', user);
    } catch (error) {
      console.error('LoginScreen: Error saving user to localStorage:', error);
    }
    
    // Call the parent's onLogin function
    onLogin(user);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="text-center space-y-4 mb-8">
          <Heart className="w-12 h-12 text-pink-500 mx-auto" fill="currentColor" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
          <p className="text-gray-600 dark:text-gray-300">Please select your name and enter your password</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedUser('Ayberk')}
              className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-3 ${
                selectedUser === 'Ayberk'
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 flex items-center justify-center border-purple-500 bg-purple-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="2" width="12" height="4" fill="#5b21b6" />
                  <rect x="6" y="6" width="12" height="8" fill="#f9a8d4" />
                  <rect x="8" y="8" width="2" height="2" fill="#1e293b" />
                  <rect x="14" y="8" width="2" height="2" fill="#1e293b" />
                  <rect x="10" y="10" width="4" height="2" fill="#9333ea" />
                  <rect x="8" y="14" width="8" height="6" fill="#9333ea" />
                  <rect x="4" y="14" width="4" height="2" fill="#9333ea" />
                  <rect x="16" y="14" width="4" height="2" fill="#9333ea" />
                  <rect x="8" y="20" width="3" height="4" fill="#9333ea" />
                  <rect x="13" y="20" width="3" height="4" fill="#9333ea" />
                </svg>
              </div>
              <span>Ayberk</span>
            </button>
            <button
              onClick={() => setSelectedUser('Selvi')}
              className={`px-4 py-3 rounded-xl border transition-all flex items-center justify-center gap-3 ${
                selectedUser === 'Selvi'
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
                  : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 flex items-center justify-center border-pink-500 bg-pink-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="2" width="16" height="4" fill="#ec4899" />
                  <rect x="4" y="6" width="2" height="4" fill="#ec4899" />
                  <rect x="18" y="6" width="2" height="4" fill="#ec4899" />
                  <rect x="6" y="6" width="12" height="8" fill="#f9a8d4" />
                  <rect x="8" y="8" width="2" height="2" fill="#1e293b" />
                  <rect x="14" y="8" width="2" height="2" fill="#1e293b" />
                  <rect x="10" y="10" width="4" height="2" fill="#ec4899" />
                  <rect x="8" y="14" width="8" height="6" fill="#ec4899" />
                  <rect x="6" y="16" width="2" height="4" fill="#ec4899" />
                  <rect x="16" y="16" width="2" height="4" fill="#ec4899" />
                  <rect x="8" y="20" width="3" height="4" fill="#f9a8d4" />
                  <rect x="13" y="20" width="3" height="4" fill="#f9a8d4" />
                </svg>
              </div>
              <span>Selvi</span>
            </button>
          </div>

          <div className="space-y-2">
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin(selectedUser as 'Ayberk' | 'Selvi')}
            />
          </div>

          <button
            onClick={() => handleLogin(selectedUser as 'Ayberk' | 'Selvi')}
            disabled={!selectedUser || !password}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl
              disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            Enter Our Memories
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 