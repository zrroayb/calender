// Telegram configuration

// Bot configuration
export const TELEGRAM_CONFIG = {
  botToken: "7792393190:AAHkP5aW7fCQbu4jV85aggxWk9dVUsuTf-E",
  botName: "@memoriescalenderbot",
  
  // Default chat IDs are now handled by getDefaultChatId function
  defaultChatIds: {
    ayberk: '6250902484',
    selvi: '11111'
  }
};

// Helper function to save chat IDs
export function saveChatId(user: 'Ayberk' | 'Selvi', chatId: string): void {
  try {
    if (typeof window !== 'undefined') {
      // Ensure the chat ID is in the correct format (numeric)
      const cleanedChatId = chatId.trim().replace(/[^0-9-]/g, '');
      localStorage.setItem(`${user.toLowerCase()}_chat_id`, cleanedChatId);
      console.log(`Saved chat ID for ${user}: ${cleanedChatId}`);
    }
  } catch (error) {
    console.error('Failed to save chat ID:', error);
  }
}

// Helper function to get chat IDs
export function getChatId(user: 'Ayberk' | 'Selvi'): string {
  try {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem(`${user.toLowerCase()}_chat_id`);
      // Only return saved IDs that are valid (non-empty)
      if (savedId && savedId.trim()) {
        console.log(`Retrieved chat ID for ${user}: ${savedId}`);
        return savedId;
      }
      const defaultId = getDefaultChatId(user);
      console.log(`No saved chat ID for ${user}, using default: ${defaultId}`);
      return defaultId;
    }
    return getDefaultChatId(user);
  } catch (error) {
    console.error('Failed to get chat ID:', error);
    return getDefaultChatId(user);
  }
}

// Add this function to manually set chat IDs for testing
export function setTestChatIds() {
  try {
    if (typeof window !== 'undefined') {
      // Use different chat IDs for each user
      const ayberkChatId = '6250902484';
      const selviChatId = '7113830523';
      
      localStorage.setItem('ayberk_chat_id', ayberkChatId);
      localStorage.setItem('selvi_chat_id', selviChatId);
      
      console.log('Set chat IDs for both users:', {
        ayberk: ayberkChatId,
        selvi: selviChatId
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to set chat IDs:', error);
    return false;
  }
}

// Add this function to check if chat IDs are properly set
export function checkChatIds(): { ayberk: boolean, selvi: boolean } {
  try {
    if (typeof window !== 'undefined') {
      const ayberkChatId = localStorage.getItem('ayberk_chat_id');
      const selviChatId = localStorage.getItem('selvi_chat_id');
      
      return {
        ayberk: !!(ayberkChatId && ayberkChatId.trim()),
        selvi: !!(selviChatId && selviChatId.trim())
      };
    }
    return { ayberk: false, selvi: false };
  } catch (error) {
    console.error('Failed to check chat IDs:', error);
    return { ayberk: false, selvi: false };
  }
}

// Also update the default chat IDs to be user-specific
export function getDefaultChatId(user: 'Ayberk' | 'Selvi'): string {
  return user === 'Ayberk' ? '6250902484' : '11111';
} 