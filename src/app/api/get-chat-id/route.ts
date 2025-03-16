import { NextResponse } from 'next/server';

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
    
    const data = await response.json();
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