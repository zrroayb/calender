// Telegram notification utility
import { TELEGRAM_CONFIG, getChatId } from './telegramConfig';
import { toast } from 'react-hot-toast';

export async function sendTelegramNotification(
  sender: 'Ayberk' | 'Selvi',
  action: 'photo' | 'comment',
  date: string
): Promise<boolean> {
  try {
    // Determine recipient based on sender
    const recipient = sender === 'Ayberk' ? 'Selvi' : 'Ayberk';
    const chatId = getChatId(recipient);
    
    console.log(`Sending notification from ${sender} to ${recipient} with chat ID: ${chatId}`);
    
    // Skip if not configured
    if (!TELEGRAM_CONFIG.botToken) {
      console.error('Telegram notification skipped: Bot token not configured');
      return false;
    }
    
    if (!chatId) {
      console.error(`Telegram notification skipped: No chat ID for ${recipient}`);
      return false;
    }
    
    // Check if using default chat ID
    const storedChatId = typeof window !== 'undefined' 
      ? localStorage.getItem(`${recipient.toLowerCase()}_chat_id`) 
      : null;
    
    if (!storedChatId && chatId === TELEGRAM_CONFIG.defaultChatId) {
      console.warn(`Using default chat ID for ${recipient}. Notifications may not be reliable.`);
    }
    
    // Create message
    const actionText = action === 'photo' ? 'added a new photo' : 'left a comment';
    const message = `❤️ ${sender} ${actionText} on ${date}! Check your memory calendar!`;
    
    console.log(`Sending message: ${message}`);
    
    // Send message via Telegram API
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      }
    );
    
    const data = await response.json();
    
    if (data.ok) {
      console.log('Telegram notification sent successfully');
      return true;
    } else {
      console.error('Telegram API error:', data);
      
      // Special handling for chat not found errors
      if (data.error_code === 400 || data.description?.includes('chat not found')) {
        toast.error(`Chat ID for ${recipient} is invalid. Please update in settings.`);
      }
      
      return false;
    }
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
} 