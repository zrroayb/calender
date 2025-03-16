// Telegram configuration

// Bot configuration
export const TELEGRAM_CONFIG = {
  botToken: "7792393190:AAHkP5aW7fCQbu4jV85aggxWk9dVUsuTf-E",
  botName: "@memoriescalenderbot",
  
  // Default chat ID - this should be a numeric ID
  defaultChatId: "" // Empty to force users to set their own
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
      console.log(`No valid chat ID for ${user}, notifications will be disabled`);
      return '';
    }
    return '';
  } catch (error) {
    console.error('Failed to get chat ID:', error);
    return '';
  }
}

// Add this function to manually set chat IDs for testing
export function setTestChatIds() {
  try {
    if (typeof window !== 'undefined') {
      // Use a known working chat ID for testing
      const testChatId = '5037608345'; // Replace with your actual test chat ID
      
      localStorage.setItem('ayberk_chat_id', testChatId);
      localStorage.setItem('selvi_chat_id', testChatId);
      
      console.log('Set test chat IDs for both users:', testChatId);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to set test chat IDs:', error);
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