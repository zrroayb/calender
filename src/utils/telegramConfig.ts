// Telegram configuration

// Bot configuration
export const TELEGRAM_CONFIG = {
  botToken: "7792393190:AAHkP5aW7fCQbu4jV85aggxWk9dVUsuTf-E",
  botName: "@memoriescalenderbot", // Update this with your actual bot name
  
  // These will be populated by users during setup
  ayberkChatId: "gcrayb",
  selviChatId: "gcrayb"
};

// Helper function to save chat IDs
export function saveChatId(user: 'Ayberk' | 'Selvi', chatId: string): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${user.toLowerCase()}_chat_id`, chatId);
    }
  } catch (error) {
    console.error('Failed to save chat ID:', error);
  }
}

// Helper function to get chat IDs
export function getChatId(user: 'Ayberk' | 'Selvi'): string {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`${user.toLowerCase()}_chat_id`) || '';
    }
    return '';
  } catch (error) {
    console.error('Failed to get chat ID:', error);
    return '';
  }
} 