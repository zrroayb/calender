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