import { supabase } from './index';
import { ChatMessage, routeMessage, ChatResponse } from './router';

/**
 * Interface for the chat session
 */
export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

/**
 * Save a new chat message to the database
 * @param sessionId ID of the chat session
 * @param message Message to save
 * @returns Boolean indicating success
 */
export async function saveChatMessage(
  sessionId: string,
  message: ChatMessage
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: message.role,
        content: message.content,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving chat message:', error);
    return false;
  }
}

/**
 * Create a new chat session
 * @param userId ID of the user
 * @param title Initial title for the chat
 * @returns The created chat session or null if error
 */
export async function createChatSession(
  userId: string,
  title: string = 'New Chat'
): Promise<ChatSession | null> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        title,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      createdAt: data.created_at,
      messages: []
    };
  } catch (error) {
    console.error('Error creating chat session:', error);
    return null;
  }
}

/**
 * Get all chat sessions for a user
 * @param userId ID of the user
 * @returns Array of chat sessions
 */
export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('id, user_id, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const sessions: ChatSession[] = [];
    
    for (const session of data) {
      // Get messages for each session
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('role, content, created_at')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });
      
      if (messagesError) throw messagesError;
      
      sessions.push({
        id: session.id,
        userId: session.user_id,
        title: session.title,
        createdAt: session.created_at,
        messages: messages.map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content
        }))
      });
    }
    
    return sessions;
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return [];
  }
}

/**
 * Process a user message and get a response
 * @param sessionId ID of the chat session
 * @param message User's message
 * @param chatHistory Previous messages in the conversation
 * @returns Response with source and message
 */
export async function processUserMessage(
  sessionId: string,
  message: string,
  chatHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  try {
    // Save the user message
    const userMessage: ChatMessage = { role: 'user', content: message };
    await saveChatMessage(sessionId, userMessage);
    
    // Route the message to get a response
    const response = await routeMessage(message, chatHistory, sessionId);
    
    // Save the assistant's response
    await saveChatMessage(sessionId, response.message);
    
    return response;
  } catch (error) {
    console.error('Error processing user message:', error);
    
    const errorResponse: ChatResponse = {
      source: 'error',
      message: {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your message. Please try again.'
      }
    };
    
    // Save the error response
    await saveChatMessage(sessionId, errorResponse.message);
    
    return errorResponse;
  }
}
