import { NextRequest, NextResponse } from 'next/server';
import { createChatSession } from '@/lib/supabase/chatService';
import { getSessionContext } from '@/lib/supabase/sessionContext';
import { smartRouter, ChatMessage } from '@/lib/api/smartRouter';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, chatHistory, gptMode } = await req.json();
    
    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // If no session ID is provided, create a new chat session
    let actualSessionId = sessionId;
    if (!actualSessionId) {
      const session = await createChatSession('anonymous'); // Use actual user ID when available
      if (!session) {
        throw new Error('Failed to create chat session');
      }
      actualSessionId = session.id;
    }
    
    // Convert chat history to the correct format if provided
    const formattedChatHistory: ChatMessage[] = chatHistory || [];
    
    // Process the message through the smart router
    const response = await smartRouter(
      message,
      formattedChatHistory,
      actualSessionId,
      gptMode || 'enabled' // Default to enabled if not provided
    );
    
    // Get session context if available
    let context = null;
    try {
      context = await getSessionContext(actualSessionId);
    } catch (error) {
      console.warn('Failed to get session context:', error);
    }
    
    return NextResponse.json({
      sessionId: actualSessionId,
      source: response.source,
      message: response.content,
      services: response.services || [],
      context: context
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Fallback to simple response generator if the intelligent router fails
    return NextResponse.json({
      source: 'fallback',
      message: generateFallbackResponse(error instanceof Error ? error.message : 'Unknown error')
    });
  }
}

// Fallback response generator if the Supabase-GPT integration fails
function generateFallbackResponse(errorDetails: string): string {
  console.error('Using fallback response due to error:', errorDetails);
  
  return `I'm your AD Pulse assistant. I can help you find services in Abu Dhabi!

How can I help you today?
• Find a service provider
• Compare prices
• View service ratings
• Search for emergency services
• Learn about premium services

Please let me know what you're looking for.`;
}
