// Telegram configuration

// Bot configuration
export const TELEGRAM_CONFIG = {
  botToken: "7792393190:AAHkP5aW7fCQbu4jV85aggxWk9dVUsuTf-E",
  botName: "@memoriescalenderbot",
  
  // Default chat IDs (for testing)
  defaultChatId: "gcrayb"
};

// Helper function to save chat IDs
export function saveChatId(user: 'Ayberk' | 'Selvi', chatId: string): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${user.toLowerCase()}_chat_id`, chatId);
      console.log(`Saved chat ID for ${user}: ${chatId}`);
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
      // If no saved ID, use the default
      const chatId = savedId || TELEGRAM_CONFIG.defaultChatId;
      console.log(`Retrieved chat ID for ${user}: ${chatId}`);
      return chatId;
    }
    return TELEGRAM_CONFIG.defaultChatId;
  } catch (error) {
    console.error('Failed to get chat ID:', error);
    return TELEGRAM_CONFIG.defaultChatId;
  }
} 