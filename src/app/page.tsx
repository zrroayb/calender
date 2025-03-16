'use client';

import { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import LoveHeart from '@/components/LoveHeart';
import { toast, Toaster } from 'react-hot-toast';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<'Ayberk' | 'Selvi' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    try {
      const user = localStorage.getItem('currentUser') as 'Ayberk' | 'Selvi' | null;
      console.log('Current user from localStorage:', user);
      
      if (user && (user === 'Ayberk' || user === 'Selvi')) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        console.log('User is logged in as:', user);
      } else {
        console.log('No valid user found in localStorage');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  }, []);
  
  // Handle login from Calendar component
  const handleLogin = (user: 'Ayberk' | 'Selvi') => {
    console.log('Login handler called with user:', user);
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', user);
  };
  
  return (
    <div className="relative min-h-screen">
      <Toaster position="top-center" />
      <main className="min-h-screen p-4">
        <Calendar onLogin={handleLogin} currentUser={currentUser} />
      </main>
      
      {/* Debug info */}
      <div className="hidden">
        Login status: {isLoggedIn ? 'Logged in' : 'Not logged in'}, 
        User: {currentUser || 'none'}
      </div>
      
      {/* Show heart only when logged in */}
      {isLoggedIn && currentUser && (
        <LoveHeart currentUser={currentUser} />
      )}
    </div>
  );
}
