'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LoginScreenProps {
  onLogin: (user: 'Ayberk' | 'Selvi') => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedUser, setSelectedUser] = useState<'Ayberk' | 'Selvi' | null>(null);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!selectedUser) return;

    const correctPassword = selectedUser === 'Ayberk' ? 'selvi' : 'ayberk';
    
    if (password.toLowerCase() === correctPassword) {
      onLogin(selectedUser);
      toast.success(`Welcome ${selectedUser}! ❤️`);
    } else {
      toast.error('Incorrect password');
    }
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
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" 
                    fill="#9333ea" />
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
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" 
                    fill="#ec4899" />
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
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            onClick={handleLogin}
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