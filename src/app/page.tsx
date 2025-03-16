'use client';

import Calendar from '@/components/Calendar';
import LoveHeart from '@/components/LoveHeart';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <main className="min-h-screen p-4">
        <Calendar />
      </main>
      {currentUser && <LoveHeart currentUser={currentUser} />}
    </div>
  );
}
