import { NextRequest, NextResponse } from 'next/server';
import { ChatService } from '@/lib/chat/ChatService';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Initialize ChatService
    const chatService = new ChatService(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      process.env.OPENAI_API_KEY || ''
    );

    // Process message
    const response = await chatService.processUserMessage(message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Initialize ChatService
    const chatService = new ChatService(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      process.env.OPENAI_API_KEY || ''
    );

    // Verify database structure
    const verificationResult = await chatService.verifyDatabaseStructure();

    return NextResponse.json(verificationResult);
  } catch (error) {
    console.error('Error verifying database:', error);
    return NextResponse.json(
      { error: 'Failed to verify database' },
      { status: 500 }
    );
  }
}
