import { NextResponse } from 'next/server';

// Define types for Telegram API responses
interface TelegramChat {
  id: number;
  type: string;
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface TelegramMessage {
  message_id: number;
  from?: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
  };
  chat: TelegramChat;
  date: number;
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
  edited_channel_post?: TelegramMessage;
}

interface TelegramResponse {
  ok: boolean;
  result: TelegramUpdate[];
  description?: string;
  error_code?: number;
}

export async function POST(request: Request) {
  try {
    const { botToken } = await request.json();
    
    if (!botToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Bot token is required' 
      }, { status: 400 });
    }
    
    // Get updates from the bot to find chat IDs
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/getUpdates`,
      { method: 'GET' }
    );
    
    const data: TelegramResponse = await response.json();
    console.log('Telegram getUpdates response:', data);
    
    if (!data.ok) {
      return NextResponse.json({ 
        success: false, 
        error: data.description || 'Failed to get updates from Telegram' 
      }, { status: 500 });
    }
    
    // Extract chat IDs from the updates
    const chatIds = data.result
      .filter(update => update.message && update.message.chat)
      .map(update => update.message.chat.id)
      .filter((id, index, self) => self.indexOf(id) === index); // Remove duplicates
    
    return NextResponse.json({ 
      success: true, 
      chatIds 
    });
  } catch (error) {
    console.error('Error getting chat IDs:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 