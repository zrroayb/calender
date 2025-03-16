'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MessageCircle, Copy, Check, Save } from 'lucide-react';
import { TELEGRAM_CONFIG, saveChatId, getChatId } from '@/utils/telegramConfig';
import { toast } from 'react-hot-toast';

interface TelegramSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: 'Ayberk' | 'Selvi';
}

export default function TelegramSetupGuide({ isOpen, onClose, currentUser }: TelegramSetupGuideProps) {
  const [copied, setCopied] = useState(false);
  const [chatId, setChatId] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [chatIdStatus, setChatIdStatus] = useState<'empty' | 'saved' | 'default'>('empty');
  
  // Load saved chat ID on open
  useEffect(() => {
    if (isOpen) {
      const savedChatId = getChatId(currentUser);
      setChatId(savedChatId);
      setSaveSuccess(false);
      
      // Check if it's using the default or a saved value
      const storedChatId = localStorage.getItem(`${currentUser.toLowerCase()}_chat_id`);
      if (!storedChatId) {
        setChatIdStatus('default');
      } else if (storedChatId === savedChatId) {
        setChatIdStatus('saved');
      } else {
        setChatIdStatus('empty');
      }
    }
  }, [isOpen, currentUser]);
  
  const handleCopyCommand = () => {
    navigator.clipboard.writeText(`/start`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSaveChatId = () => {
    saveChatId(currentUser, chatId);
    setSaveSuccess(true);
    setChatIdStatus('saved');
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const handleTestNotification = async () => {
    try {
      // Show loading state
      setSaveSuccess(true);
      
      // Send a test notification
      const result = await fetch('/api/test-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          user: currentUser
        }),
      });
      
      const data = await result.json();
      
      if (data.success) {
        toast.success('Test notification sent successfully!');
      } else {
        toast.error(`Failed to send test notification: ${data.error}`);
      }
    } catch (error) {
      console.error('Test notification error:', error);
      toast.error('Failed to send test notification. Check console for details.');
    } finally {
      setSaveSuccess(false);
    }
  };
  
  const handleDebugInfo = () => {
    const ayberkChatId = localStorage.getItem('ayberk_chat_id') || 'not set';
    const selviChatId = localStorage.getItem('selvi_chat_id') || 'not set';
    
    const debugInfo = {
      currentUser,
      botToken: TELEGRAM_CONFIG.botToken ? 'configured' : 'missing',
      botName: TELEGRAM_CONFIG.botName,
      defaultChatId: TELEGRAM_CONFIG.defaultChatId,
      ayberkChatId,
      selviChatId,
      currentChatId: chatId,
      chatIdStatus,
      localStorage: typeof window !== 'undefined' ? 'available' : 'unavailable'
    };
    
    console.log('Telegram Debug Info:', debugInfo);
    toast.success('Debug info logged to console');
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageCircle className="text-purple-500" />
            Telegram Notification Setup
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X />
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Get notified when your partner adds new memories or comments! Follow these steps:
          </p>
          
          <ol className="list-decimal pl-5 space-y-3 text-gray-600 dark:text-gray-300">
            <li>Open Telegram and search for <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">{TELEGRAM_CONFIG.botName}</span></li>
            <li>Start a chat with the bot by clicking &ldquo;Start&rdquo; or sending the command below:</li>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded">
              <code className="flex-1 font-mono">/start</code>
              <button 
                onClick={handleCopyCommand}
                className="text-purple-500 hover:text-purple-700 p-1"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <li>The bot will respond with a welcome message and your Chat ID</li>
            <li>Enter your Chat ID below:</li>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatId}
                onChange={(e) => {
                  setChatId(e.target.value);
                  setChatIdStatus(e.target.value ? 'empty' : 'default');
                }}
                placeholder="Enter your Chat ID"
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  chatIdStatus === 'default' 
                    ? 'border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' 
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700'
                } text-gray-900 dark:text-white`}
              />
              <button 
                onClick={handleSaveChatId}
                className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg"
                disabled={!chatId.trim()}
              >
                {saveSuccess ? <Check size={20} /> : <Save size={20} />}
              </button>
            </div>
          </ol>
          
          {chatIdStatus === 'default' && (
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Using default chat ID. Please enter your personal chat ID for reliable notifications.
            </p>
          )}
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mt-4">
            <p className="text-sm text-purple-700 dark:text-purple-300">
              <strong>Note:</strong> This setup ensures you&apos;ll receive notifications when your partner adds new memories or comments to your shared calendar.
            </p>
          </div>
          
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleDebugInfo}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm"
            >
              Debug Info
            </button>
            
            <button
              onClick={handleTestNotification}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm"
              disabled={!chatId.trim()}
            >
              Test Notification
            </button>
          </div>
          
          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 