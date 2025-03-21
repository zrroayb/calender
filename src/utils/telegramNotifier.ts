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
      toast.error(`Can't send notification: ${recipient}'s chat ID is not set`);
      return false;
    }
    
    // Validate chat ID format
    const cleanedChatId = chatId.trim().replace(/[^0-9-]/g, '');
    if (!cleanedChatId) {
      console.error(`Invalid chat ID format for ${recipient}: ${chatId}`);
      toast.error(`Invalid chat ID format for ${recipient}`);
      return false;
    }
    
    // Create message with more details and a clickable link
    const actionText = action === 'photo' ? 'added a new photo' : 'left a comment';
    
    // Create HTML message with a clickable link
    const message = `❤️ ${sender} ${actionText} on ${date}!\n\n<a href="https://calender-five-bay.vercel.app">Click here to view your memory calendar</a>`;
    
    console.log(`Sending message to ${cleanedChatId}: ${message}`);
    
    // Log the full request details for debugging
    const requestBody = {
      chat_id: cleanedChatId,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: false
    };
    
    console.log('Telegram API request:', {
      url: `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken.substring(0, 5)}***/sendMessage`,
      method: 'POST',
      body: requestBody
    });
    
    // Send message via Telegram API
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );
    
    const data = await response.json();
    
    if (data.ok) {
      console.log(`Telegram notification sent successfully to ${recipient}`);
      return true;
    } else {
      console.error('Telegram API error:', data);
      
      // Special handling for chat not found errors
      if (data.error_code === 400 || data.description?.includes('chat not found')) {
        toast.error(`Chat ID for ${recipient} is invalid. Please update in settings.`);
        console.error(`Invalid chat ID: ${cleanedChatId} for user ${recipient}`);
      }
      
      return false;
    }
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
} 