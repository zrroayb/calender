import { NextResponse } from 'next/server';
import { TELEGRAM_CONFIG } from '@/utils/telegramConfig';

export async function POST(request: Request) {
  try {
    const { chatId, user } = await request.json();
    
    if (!chatId) {
      return NextResponse.json({ success: false, error: 'Chat ID is required' }, { status: 400 });
    }
    
    if (!TELEGRAM_CONFIG.botToken) {
      return NextResponse.json({ success: false, error: 'Bot token is not configured' }, { status: 500 });
    }
    
    // Send a test message
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔔 Test notification from ${user}! If you're seeing this, your Telegram notifications are working correctly.`,
          parse_mode: 'HTML'
        }),
      }
    );
    
    const data = await response.json();
    
    if (data.ok) {
      return NextResponse.json({ success: true });
    } else {
      console.error('Telegram API error:', data);
      return NextResponse.json({ 
        success: false, 
        error: data.description || 'Unknown Telegram API error' 
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