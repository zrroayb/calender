'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MessageCircle, Copy, Check, Save } from 'lucide-react';
import { TELEGRAM_CONFIG, saveChatId, getChatId, setTestChatIds, checkChatIds } from '@/utils/telegramConfig';
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
  const [chatIdError, setChatIdError] = useState('');
  
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
    // Validate the chat ID format
    const cleanedChatId = chatId.trim().replace(/[^0-9-]/g, '');
    
    if (!cleanedChatId) {
      setChatIdError('Please enter a valid numeric chat ID');
      return;
    }
    
    if (cleanedChatId !== chatId.trim()) {
      setChatId(cleanedChatId);
    }
    
    saveChatId(currentUser, cleanedChatId);
    setSaveSuccess(true);
    setChatIdStatus('saved');
    setChatIdError('');
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
    const chatIdStatus = checkChatIds();
    
    const debugInfo = {
      currentUser,
      botToken: TELEGRAM_CONFIG.botToken ? 'configured' : 'missing',
      botName: TELEGRAM_CONFIG.botName,
      ayberkChatId,
      selviChatId,
      chatIdStatus,
      currentChatId: chatId,
      localStorage: typeof window !== 'undefined' ? 'available' : 'unavailable'
    };
    
    console.log('Telegram Debug Info:', debugInfo);
    
    // Display a more user-friendly message
    toast.success(
      `Debug info logged to console. Chat IDs: Ayberk (${chatIdStatus.ayberk ? '✅' : '❌'}), Selvi (${chatIdStatus.selvi ? '✅' : '❌'})`
    );
  };
  
  // Add this function to help users get their chat ID
  const handleGetChatId = async () => {
    try {
      setSaveSuccess(true);
      
      // Call the bot to get the chat ID
      const response = await fetch('/api/get-chat-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botToken: TELEGRAM_CONFIG.botToken
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.chatIds && data.chatIds.length > 0) {
        // Show the available chat IDs
        toast.success('Found chat IDs! Select one to use.');
        
        // Display the chat IDs in a more user-friendly way
        console.log('Available chat IDs:', data.chatIds);
        
        // If there's only one, suggest using it
        if (data.chatIds.length === 1) {
          setChatId(data.chatIds[0].toString());
        }
      } else {
        toast.error('No chat IDs found. Please start a conversation with the bot first.');
      }
    } catch (error) {
      console.error('Error getting chat IDs:', error);
      toast.error('Failed to get chat IDs. Please try again.');
    } finally {
      setSaveSuccess(false);
    }
  };
  
  const handleFixAll = () => {
    if (setTestChatIds()) {
      toast.success('Test chat IDs set for both users!');
      
      // Update the current chat ID in the form
      const savedChatId = getChatId(currentUser);
      setChatId(savedChatId);
      setChatIdStatus('saved');
    } else {
      toast.error('Failed to set test chat IDs');
    }
  };
  
  const otherUser = currentUser === 'Ayberk' ? 'Selvi' : 'Ayberk';
  const otherUserChatId = localStorage.getItem(`${otherUser.toLowerCase()}_chat_id`) || 'not set';
  
  // Add this function to fix Selvi's chat ID specifically
  const handleFixSelviChatId = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('selvi_chat_id', '7113830523');
        toast.success('Fixed Selvi\'s chat ID!');
        
        // Update the current chat ID if the current user is Selvi
        if (currentUser === 'Selvi') {
          setChatId('7113830523');
          setChatIdStatus('saved');
        }
      }
    } catch (error) {
      console.error('Failed to fix Selvi\'s chat ID:', error);
      toast.error('Failed to fix Selvi\'s chat ID');
    }
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
            <li>
              <p>Enter your Chat ID below (numbers only):</p>
              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                <p><strong>Important:</strong> The Chat ID should be a number like <code>123456789</code> or <code>-1001234567890</code>.</p>
                <p className="mt-1">If you don&apos;t see your Chat ID, send the <code>/id</code> command to the bot.</p>
              </div>
            </li>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatId}
                onChange={(e) => {
                  setChatId(e.target.value);
                  setChatIdStatus(e.target.value ? 'empty' : 'default');
                  setChatIdError('');
                }}
                placeholder="Enter your Chat ID (numbers only)"
                className={`flex-1 px-3 py-2 rounded-lg border ${
                  chatIdError ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20' :
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
            {chatIdError && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {chatIdError}
              </p>
            )}
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
          
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Having trouble finding your Chat ID? Try these options:
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Use the correct chat ID for the current user
                  const testId = currentUser === 'Ayberk' ? '6250902484' : '7113830523';
                  setChatId(testId);
                  setChatIdStatus('empty');
                  setChatIdError('');
                }}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
              >
                Use Test ID
              </button>
              <button
                onClick={handleGetChatId}
                className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
              >
                Find My Chat ID
              </button>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
              <strong>Having trouble?</strong> Use this button to fix notification issues:
            </p>
            <button
              onClick={handleFixAll}
              className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
            >
              Fix All Notifications
            </button>
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
              This will set working chat IDs for both users.
            </p>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Important:</strong> You are setting up notifications for <strong>{currentUser}</strong>.
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              When you add content, notifications will be sent to <strong>{otherUser}</strong>.
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
              {otherUser}&apos;s chat ID: {otherUserChatId !== 'not set' ? '✅ Set' : '❌ Not set'}
            </p>
          </div>
          
          <div className="mt-2">
            <button
              onClick={handleFixSelviChatId}
              className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
            >
              Fix Selvi's Chat ID
            </button>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Use this if notifications to Selvi aren't working
            </p>
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