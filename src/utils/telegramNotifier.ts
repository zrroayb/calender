// Telegram notification utility
import { TELEGRAM_CONFIG, getChatId } from './telegramConfig';

export async function sendTelegramNotification(
  sender: 'Ayberk' | 'Selvi',
  action: 'photo' | 'comment',
  date: string
): Promise<boolean> {
  try {
    // Determine recipient based on sender
    const recipient = sender === 'Ayberk' ? 'Selvi' : 'Ayberk';
    const chatId = getChatId(recipient);
    
    // Skip if not configured
    if (!TELEGRAM_CONFIG.botToken || !chatId) {
      console.log('Telegram notification skipped: Missing configuration');
      return false;
    }
    
    // Create message
    const actionText = action === 'photo' ? 'added a new photo' : 'left a comment';
    const message = `❤️ ${sender} ${actionText} on ${date}! Check your memory calendar!`;
    
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
    return data.ok === true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
} 