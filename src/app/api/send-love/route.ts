import { NextResponse } from 'next/server';
import { TELEGRAM_CONFIG, getChatId } from '@/utils/telegramConfig';

export async function POST(request: Request) {
  try {
    console.log('Love message API called');
    const { sender } = await request.json();
    console.log('Sender:', sender);
    
    if (!sender || (sender !== 'Ayberk' && sender !== 'Selvi')) {
      console.error('Invalid sender:', sender);
      return NextResponse.json({ success: false, error: 'Invalid sender' }, { status: 400 });
    }
    
    // Determine recipient based on sender
    const recipient = sender === 'Ayberk' ? 'Selvi' : 'Ayberk';
    const chatId = getChatId(recipient);
    console.log(`Sending love message from ${sender} to ${recipient} with chat ID: ${chatId}`);
    
    if (!chatId) {
      console.error(`No chat ID found for ${recipient}`);
      return NextResponse.json({ 
        success: false, 
        error: `No chat ID found for ${recipient}` 
      }, { status: 400 });
    }
    
    // Send love message via Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: `❤️ Seni seviyorum <3 ❤️\n\n- ${sender}`,
          parse_mode: 'HTML',
        }),
      }
    );
    
    const data = await response.json();
    console.log('Telegram API response:', data);
    
    if (data.ok) {
      console.log('Love message sent successfully');
      return NextResponse.json({ success: true });
    } else {
      console.error('Telegram API error:', data);
      return NextResponse.json({ 
        success: false, 
        error: data.description || 'Failed to send message' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending love message:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 