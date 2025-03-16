'use client';

import { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import LoveHeart from '@/components/LoveHeart';

export default function Home() {
  // Get the current user from localStorage or state
  const [currentUser, setCurrentUser] = useState<'Ayberk' | 'Selvi' | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser') as 'Ayberk' | 'Selvi' | null;
    setCurrentUser(user);
  }, []);
  
  return (
    <div className="relative min-h-screen">
      <main className="min-h-screen p-4">
        <Calendar />
      </main>
      {currentUser && <LoveHeart currentUser={currentUser} />}
    </div>
  );
}
