'use client';

import { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import LoveHeart from '@/components/LoveHeart';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<'Ayberk' | 'Selvi' | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user from localStorage on initial render
  useEffect(() => {
    // Check if user is logged in
    try {
      // Use a more reliable way to get the current user
      const storedUser = localStorage.getItem('currentUser');
      console.log('Retrieved user from localStorage:', storedUser);
      
      if (storedUser && (storedUser === 'Ayberk' || storedUser === 'Selvi')) {
        setCurrentUser(storedUser as 'Ayberk' | 'Selvi');
        setIsLoggedIn(true);
        console.log('User is logged in as:', storedUser);
      } else {
        console.log('No valid user found in localStorage');
        // Clear any invalid values
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Handle login from Calendar component
  const handleLogin = (user: 'Ayberk' | 'Selvi') => {
    console.log('Login handler called with user:', user);
    
    // Save to state
    setCurrentUser(user);
    setIsLoggedIn(true);
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem('currentUser', user);
      console.log('Saved user to localStorage:', user);
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
    console.log('User logged out');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-purple-500">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen">
      <Toaster position="top-center" />
      
      {/* Add logout button */}
      {isLoggedIn && currentUser && (
        <button
          onClick={handleLogout}
          className="fixed top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-xs z-50"
        >
          Logout ({currentUser})
        </button>
      )}
      
      <main className="min-h-screen p-4">
        <Calendar 
          onLogin={handleLogin} 
          currentUser={currentUser} 
        />
      </main>
      
      {/* Debug info */}
      <div className="hidden">
        Login status: {isLoggedIn ? 'Logged in' : 'Not logged in'}, 
        User: {currentUser || 'none'}
      </div>
      
      {/* Debug button - only visible in development */}
      {process.env.NODE_ENV === 'development' && !isLoggedIn && (
        <button 
          onClick={() => {
            console.log('Debug button clicked');
            const defaultUser = 'Ayberk';
            setCurrentUser(defaultUser);
            setIsLoggedIn(true);
            localStorage.setItem('currentUser', defaultUser);
            console.log('Set default user:', defaultUser);
          }}
          className="fixed top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-md text-xs z-50"
        >
          Debug Login
        </button>
      )}
      
      {/* Show heart only when logged in */}
      {isLoggedIn && currentUser && (
        <LoveHeart currentUser={currentUser} />
      )}
    </div>
  );
}
