'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import type { Memory } from '@/types/memory';
import { toast, Toaster } from 'react-hot-toast';
import { DAYS_OF_WEEK } from '@/constants';
import MemoryModal from './MemoryModal';
import Image from 'next/image';
import FallingHearts from './FallingHearts';
import LoginScreen from './LoginScreen';
import MobileFooter from './MobileFooter';
import AnniversaryMessage from './AnniversaryMessage';
import BackgroundDecoration from './BackgroundDecoration';
import HeartClickEffect from './HeartClickEffect';

interface CalendarProps {
  onLogin?: (user: 'Ayberk' | 'Selvi') => void;
  currentUser?: 'Ayberk' | 'Selvi' | null;
}

export default function Calendar({ onLogin, currentUser }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'add'>('add');

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch('/api/memories');
        if (!response.ok) throw new Error('Failed to fetch memories');
        const data = await response.json();
        setMemories(data);
      } catch (error) {
        console.error('Error fetching memories:', error);
        toast.error('Failed to load memories');
      }
    };

    fetchMemories();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const daysInCalendar = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weeks: Date[][] = [];
  let week: Date[] = [];

  daysInCalendar.forEach((day) => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });

  if (week.length > 0) {
    weeks.push(week);
  }

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    const dayMemories = memories.filter(
      memory => memory.date === format(date, 'yyyy-MM-dd')
    );
    setModalMode(dayMemories.length > 0 ? 'view' : 'add');
    setIsModalOpen(true);
  };

  const handleMemoryAdded = async (newMemory: Memory) => {
    try {
      // Check if this is an update to an existing memory
      const existingIndex = memories.findIndex(m => m.id === newMemory.id);
      
      if (existingIndex >= 0) {
        // This is an update (like adding a comment)
        const response = await fetch(`/api/memories/${newMemory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMemory),
        });

        if (!response.ok) throw new Error('Failed to update memory');
        
        const updatedMemory = await response.json();
        
        // Update the memory in the array
        setMemories(prev => prev.map(m => 
          m.id === updatedMemory.id ? updatedMemory : m
        ));
        
        toast.success('Memory updated successfully!');
      } else {
        // This is a new memory
        const response = await fetch('/api/memories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMemory),
        });

        if (!response.ok) throw new Error('Failed to save memory');
        
        const savedMemory = await response.json();
        setMemories(prev => [...prev, savedMemory]);
        toast.success('Memory added successfully!');
      }
    } catch (error) {
      console.error('Error saving memory:', error);
      toast.error('Failed to save memory');
    }
  };

  return (
    <div className="min-h-screen min-w-full bg-transparent p-0 m-0 overflow-x-hidden">
      <HeartClickEffect />
      {!currentUser ? (
        <LoginScreen onLogin={(user) => {
          if (onLogin) {
            onLogin(user);
          }
        }} />
      ) : (
        <div className="min-h-screen w-full bg-transparent p-2 md:p-8 pb-16 md:pb-8 relative">
          <BackgroundDecoration />
          <FallingHearts />
          <AnniversaryMessage user={currentUser} />
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header Section - Made more compact on mobile */}
            <div className="mb-4 md:mb-8 text-center space-y-2 md:space-y-4">
              <motion.div 
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">Memory Calendar</span>
              </motion.div>
              <motion.h1 
                className="text-2xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-transparent bg-clip-text tracking-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Our Special Moments
              </motion.h1>
            </div>

            {/* Main Calendar Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-[2rem] overflow-hidden shadow-xl border-0">
              {/* Calendar Header */}
              <div className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 p-4 md:p-8">
                <div className="flex flex-col space-y-4 md:space-y-6">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={previousMonth}
                      className="p-2 md:p-3 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all duration-200"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
                    </motion.button>
                    <motion.h2 
                      className="text-2xl md:text-5xl font-bold text-white tracking-tight"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {format(currentDate, 'MMMM yyyy')}
                    </motion.h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextMonth}
                      className="p-2 md:p-3 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all duration-200"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
                    </motion.button>
                  </div>

                  {/* Week Days Header - More compact on mobile */}
                  <div className="grid grid-cols-7 gap-1 md:gap-4">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day} className="text-center font-medium text-white/80 text-xs md:text-sm">
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-2 md:p-8 bg-white dark:bg-gray-800">
                <div className="grid grid-cols-7 gap-1 md:gap-4 calendar-grid">
                  {weeks.map((week, weekIndex) => (
                    <React.Fragment key={weekIndex}>
                      {week.map((day) => {
                        const isCurrentMonth = isSameMonth(day, currentDate);
                        const isCurrentDay = isToday(day);
                        const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                        const dayMemories = memories.filter(
                          memory => format(new Date(memory.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                        );
                        const hasMemories = dayMemories.length > 0;

                        return (
                          <motion.div
                            key={day.toISOString()}
                            whileHover={{ scale: 0.95, translateY: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDayClick(day)}
                            className={`
                              relative aspect-square rounded-lg md:rounded-3xl transition-all duration-300 cursor-pointer
                              ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-700'}
                              ${isCurrentDay ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-800' : ''}
                              ${isSelected ? 'bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500' : ''}
                              border border-gray-100 dark:border-gray-600
                              overflow-hidden
                              group
                              min-h-[40px] md:min-h-[80px]
                            `}
                          >
                            {/* Show the first memory's image as background if exists */}
                            {hasMemories && (
                              <div className="absolute inset-0 z-0">
                                <Image
                                  src={dayMemories[0].imageUrl}
                                  alt={dayMemories[0].caption || 'Memory'}
                                  fill
                                  className="object-cover opacity-50 group-hover:opacity-75 transition-opacity"
                                  unoptimized
                                />
                              </div>
                            )}

                            {/* Date Number - Made more visible */}
                            <span className={`
                              absolute top-1 left-1 md:top-2 md:left-2
                              text-sm md:text-lg font-semibold z-10
                              ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}
                              ${isCurrentDay ? 'text-purple-600 dark:text-purple-400' : ''}
                              ${hasMemories ? 'text-white' : ''}
                              group-hover:scale-110 transition-transform duration-300
                              bg-black/20 rounded-full w-5 h-5 md:w-7 md:h-7 flex items-center justify-center
                            `}>
                              {format(day, 'd')}
                            </span>

                            {/* Memory Count Badge */}
                            {hasMemories && (
                              <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 z-10">
                                <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                  {dayMemories.length}
                                </span>
                              </div>
                            )}

                            {/* Add Memory Icon */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              className="absolute inset-0 bg-purple-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                            >
                              <Plus className="w-6 h-6 md:w-8 md:h-8 text-purple-500" strokeWidth={2.5} />
                            </motion.div>
                          </motion.div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
              style: {
                border: '1px solid #e2e8f0',
                padding: '16px',
                borderRadius: '1rem',
              },
            }}
          />

          {selectedDate && (
            <MemoryModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              date={selectedDate}
              memories={memories.filter(
                memory => memory.date === format(selectedDate, 'yyyy-MM-dd')
              )}
              onMemoryAdded={handleMemoryAdded}
              mode={modalMode}
              currentUser={currentUser}
              setMemories={setMemories}
            />
          )}
          
          <MobileFooter currentUser={currentUser} />
        </div>
      )}
    </div>
  );
} 