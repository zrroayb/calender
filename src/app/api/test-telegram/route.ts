import { NextResponse } from 'next/server';
import { TELEGRAM_CONFIG } from '@/utils/telegramConfig';

export async function POST(request: Request) {
  try {
    const { chatId, user } = await request.json();
    
    if (!chatId) {
      return NextResponse.json({ success: false, error: 'Chat ID is required' }, { status: 400 });
    }
    
    // Validate chat ID format
    const cleanedChatId = chatId.trim().replace(/[^0-9-]/g, '');
    if (!cleanedChatId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid chat ID format. Please use only numbers.' 
      }, { status: 400 });
    }
    
    if (!TELEGRAM_CONFIG.botToken) {
      return NextResponse.json({ success: false, error: 'Bot token is not configured' }, { status: 500 });
    }
    
    console.log(`Sending test message to chat ID: ${cleanedChatId}`);
    
    // Send a test message
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: cleanedChatId,
          text: `🔔 Test notification from ${user}! If you're seeing this, your Telegram notifications are working correctly.`,
          parse_mode: 'HTML'
        }),
      }
    );
    
    const data = await response.json();
    console.log('Telegram API response:', data);
    
    if (data.ok) {
      return NextResponse.json({ success: true });
    } else {
      let errorMessage = data.description || 'Unknown Telegram API error';
      
      // Provide more helpful error messages
      if (data.error_code === 400 && data.description?.includes('chat not found')) {
        errorMessage = 'Chat not found. Make sure you have started a conversation with the bot and are using the correct numeric Chat ID.';
      }
      
      console.error('Telegram API error:', data);
      return NextResponse.json({ 
        success: false, 
        error: errorMessage
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test Telegram error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 