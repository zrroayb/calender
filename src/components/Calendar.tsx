'use client';

import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Camera, Heart, Calendar as CalendarIcon } from 'lucide-react';
import type { Memory } from '@/types/memory';
import { toast, Toaster } from 'react-hot-toast';
import { DAYS_OF_WEEK } from '@/constants';
import MemoryModal from './MemoryModal';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'add'>('add');

  useEffect(() => {
    const savedMemories = localStorage.getItem('memories');
    if (savedMemories) {
      setMemories(JSON.parse(savedMemories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('memories', JSON.stringify(memories));
  }, [memories]);

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

  const handleMemoryAdded = (newMemory: Memory) => {
    setMemories(prev => [...prev, newMemory]);
    toast.success('Memory added successfully!');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center space-y-4">
          <motion.div 
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CalendarIcon className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Memory Calendar</span>
          </motion.div>
          <motion.h1 
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-transparent bg-clip-text tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Our Special Moments
          </motion.h1>
          <motion.p>
            Capturing life&apos;s beautiful moments, one day at a time ✨
          </motion.p>
        </div>

        {/* Main Calendar Card - Replaced Card with div */}
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-2xl border-0 shadow-purple-500/5">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 p-8">
            <div className="flex flex-col space-y-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={previousMonth}
                  className="p-3 hover:bg-white/10 rounded-2xl transition-all duration-200"
                >
                  <ChevronLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
                </motion.button>
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {format(currentDate, 'MMMM yyyy')}
                </motion.h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextMonth}
                  className="p-3 hover:bg-white/10 rounded-2xl transition-all duration-200"
                >
                  <ChevronRight className="w-6 h-6 text-white" strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-4">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="text-center font-medium text-white/80 text-sm">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar Grid with Premium Styling */}
          <div className="p-8 bg-white dark:bg-gray-800">
            <div className="grid grid-cols-7 gap-4">
              {weeks.map((week, weekIndex) => (
                <React.Fragment key={weekIndex}>
                  {week.map((day) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isCurrentDay = isToday(day);
                    const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                    const hasMemories = memories.some(memory => format(new Date(memory.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));

                    return (
                      <motion.div
                        key={day.toISOString()}
                        whileHover={{ scale: 0.95, translateY: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDayClick(day)}
                        className={`
                          relative p-4 aspect-square rounded-3xl transition-all duration-300 cursor-pointer
                          ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'}
                          ${isCurrentDay ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-800' : 'hover:shadow-xl'}
                          ${isSelected ? 'bg-purple-50 dark:bg-purple-900/20 ring-2 ring-purple-500' : ''}
                          border border-gray-100 dark:border-gray-600
                          group
                        `}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Date Number */}
                        <span className={`
                          text-lg font-semibold relative z-10
                          ${!isCurrentMonth ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'}
                          ${isCurrentDay ? 'text-purple-600 dark:text-purple-400' : ''}
                          ${isSelected ? 'text-purple-600 dark:text-purple-400' : ''}
                          group-hover:scale-110 transition-transform duration-300
                        `}>
                          {format(day, 'd')}
                        </span>

                        {/* Memory Indicators */}
                        {hasMemories && (
                          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex space-x-1"
                            >
                              <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
                              <Camera className="w-4 h-4 text-purple-500" />
                            </motion.div>
                          </div>
                        )}

                        {/* Add Memory Hover Effect */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-purple-500/10 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <Plus className="w-8 h-8 text-purple-500" strokeWidth={2.5} />
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
        />
      )}
    </div>
  );
} 