import { searchServices } from '../supabase/searchServices';
import { getOpenAIResponse } from '../supabase/openai';
import { supabase } from '../supabase';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export type GptMode = 'enabled' | 'strict';

export interface SmartRouterResponse {
  source: 'supabase' | 'gpt' | 'error';
  content: string;
  services?: any[]; // Optional services data to display alongside the response
}

/**
 * Smart router that checks Supabase first and falls back to OpenAI GPT
 * @param query User's message/query
 * @param chatHistory Previous chat messages for context
 * @param userId Optional user ID for logging purposes
 * @returns Response with source and content
 */
export async function smartRouter(
  query: string,
  chatHistory: ChatMessage[] = [],
  userId?: string,
  gptMode: GptMode = 'enabled'
): Promise<SmartRouterResponse> {
  try {
    // Step 1: Try to find relevant services in Supabase
    const services = await searchServices(query);
    
    // Step 2: If services found, generate a response based on the services
    if (services && services.length > 0) {
      const responseContent = generateServiceResponse(query, services);
      
      // Log the successful Supabase response
      await logChatInteraction(userId || 'anonymous', query, responseContent, 'supabase');
      
      return {
        source: 'supabase',
        content: responseContent,
        services: services
      };
    }
    
    // Step 3: If no Supabase results and GPT fallback is enabled, use OpenAI GPT
    if (gptMode === 'enabled') {
      const gptResponse = await getOpenAIResponse(query, chatHistory);
      
      // Log the GPT fallback response
      await logChatInteraction(userId || 'anonymous', query, gptResponse, 'gpt');
      
      return {
        source: 'gpt',
        content: gptResponse
      };
    } else {
      // In strict mode, don't use GPT fallback
      const strictModeResponse = "I couldn't find any matching services in our verified database. Please try a different search term or be more specific with your request.";
      
      // Log the strict mode response
      await logChatInteraction(userId || 'anonymous', query, strictModeResponse, 'supabase');
      
      return {
        source: 'supabase',
        content: strictModeResponse
      };
    }
  } catch (error) {
    console.error('Error in smartRouter:', error);
    
    // Log the error
    if (userId) {
      await logChatInteraction(userId, query, 'Error processing request', 'error');
    }
    
    return {
      source: 'error',
      content: 'I apologize, but I encountered an error processing your request. Please try again.'
    };
  }
}

/**
 * Generate a human-friendly response based on found services
 * @param query Original user query
 * @param services Array of services found in Supabase
 * @returns Formatted response string
 */
function generateServiceResponse(query: string, services: any[]): string {
  if (!services || services.length === 0) {
    return "I couldn't find any services matching your request. Could you provide more details?";
  }
  
  const servicesCount = services.length;
  const queryWords = query.toLowerCase().split(' ');
  
  // Check if query is asking about services in a specific location
  const locationKeywords = ['in', 'near', 'around', 'at'];
  const hasLocationQuery = locationKeywords.some(keyword => queryWords.includes(keyword));
  
  let response = `I found ${servicesCount} service${servicesCount > 1 ? 's' : ''} that might interest you:\n\n`;
  
  services.forEach((service, index) => {
    response += `${index + 1}. **${service.name}**`;
    
    if (service.rating) {
      const stars = '⭐'.repeat(Math.round(service.rating));
      response += ` (${stars})`;
    }
    
    response += `\n   ${service.description}\n`;
    
    if (service.price) {
      response += `   Price: ${typeof service.price === 'number' ? `AED ${service.price}` : service.price}\n`;
    }
    
    if (service.location) {
      response += `   Location: ${service.location}\n`;
    }
    
    response += '\n';
  });
  
  response += "Would you like more details about any of these services?";
  
  return response;
}

/**
 * Log chat interactions to Supabase chat_log table
 * @param userId User ID or anonymous identifier
 * @param query User's query/message
 * @param response System's response
 * @param source Response source (supabase, gpt, error)
 */
async function logChatInteraction(
  userId: string,
  query: string,
  response: string,
  source: 'supabase' | 'gpt' | 'error'
): Promise<void> {
  try {
    const { error } = await supabase
      .from('chat_log')
      .insert({
        user_id: userId,
        query: query,
        response: response,
        source: source,
        timestamp: new Date().toISOString()
      });
      
    if (error) {
      console.error('Error logging chat interaction:', error);
    }
  } catch (error) {
    console.error('Failed to log chat interaction:', error);
  }
}
