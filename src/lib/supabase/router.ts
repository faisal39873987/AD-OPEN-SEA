import { searchServices } from './searchServices';
import { getOpenAIResponse } from './openai';
import { processMessageContext, extractLocation, extractServiceType } from './sessionContext';

/**
 * Message type for chat
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Response type for chat
 */
export interface ChatResponse {
  source: 'supabase' | 'openai' | 'error';
  message: ChatMessage;
  services?: any[]; // Optional services to display alongside the message
  updatedContext?: boolean; // Indicates if context was updated
}

/**
 * Smart router to determine whether to use Supabase data or OpenAI
 * @param message User message
 * @param chatHistory Previous chat messages for context
 * @param sessionId Chat session ID
 * @returns Response with source and message
 */
export async function routeMessage(
  message: string,
  chatHistory: ChatMessage[] = [],
  sessionId?: string
): Promise<ChatResponse> {
  try {
    // Process and update session context if sessionId is provided
    let updatedContext = false;
    if (sessionId) {
      const contextResult = await processMessageContext(sessionId, message, chatHistory);
      updatedContext = contextResult !== null;
    }
    
    // Step 1: Try to find relevant services in Supabase
    const services = await searchServices(message);
    
    // Step 2: If services found, generate a response based on the services
    if (services && services.length > 0) {
      return {
        source: 'supabase',
        message: {
          role: 'assistant',
          content: generateServiceResponse(message, services)
        },
        services: services,
        updatedContext
      };
    }
    
    // Step 3: If no services found, check if we can ask follow-up questions
    // Check if the message contains location information
    const hasLocation = extractLocation(message, chatHistory) !== undefined;
    const hasServiceType = extractServiceType(message) !== undefined;
    
    // If message lacks location or service type, ask a follow-up question
    if (!hasLocation || !hasServiceType) {
      return {
        source: 'supabase',
        message: {
          role: 'assistant',
          content: generateFollowUpQuestion(hasLocation, hasServiceType)
        },
        updatedContext
      };
    }
    
    // Step 4: If no services found and we have all needed info, use OpenAI
    const openAIResponse = await getOpenAIResponse(message, chatHistory);
    
    return {
      source: 'openai',
      message: {
        role: 'assistant',
        content: openAIResponse
      },
      updatedContext
    };
  } catch (error) {
    console.error('Error in routeMessage:', error);
    return {
      source: 'error',
      message: {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.'
      }
    };
  }
}

/**
 * Generate a response based on found services
 * @param message Original user message
 * @param services Array of services found in Supabase
 * @returns Formatted response about the services
 */
function generateServiceResponse(message: string, services: any[]): string {
  // Format the services into a readable response
  const servicesList = services.map((service, index) => 
    `${index + 1}. **${service.name}** - ${service.description.substring(0, 100)}${service.description.length > 100 ? '...' : ''} (${service.price ? `$${service.price}` : 'Price not specified'})`
  ).join('\n\n');
  
  return `I found the following services that might be helpful for your query:

${servicesList}

Would you like more information about any of these services?`;
}

/**
 * Check if the message contains an Abu Dhabi location
 * @param message The current message
 * @param chatHistory Previous messages for context
 * @returns Boolean indicating if a location was found
 */
function containsAbuDhabiLocation(message: string, chatHistory: ChatMessage[] = []): boolean {
  // List of Abu Dhabi locations/areas
  const abuDhabiLocations = [
    'abu dhabi', 'al reem', 'al reef', 'yas island', 'saadiyat', 'khalifa city',
    'masdar city', 'al raha', 'al bateen', 'corniche', 'al wahda', 'al danah',
    'al maryah', 'al ain', 'liwa', 'ghantoot', 'musaffah', 'baniyas', 'shahama',
    'al falah', 'al samha', 'al wathba', 'madinat zayed', 'hudayriat'
  ];
  
  // Check current message
  const messageLower = message.toLowerCase();
  if (abuDhabiLocations.some(location => messageLower.includes(location))) {
    return true;
  }
  
  // Check chat history for locations
  for (const msg of chatHistory) {
    if (msg.role === 'user') {
      const contentLower = msg.content.toLowerCase();
      if (abuDhabiLocations.some(location => contentLower.includes(location))) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Identify the type of service requested in the message
 * @param message The user's message
 * @returns Boolean indicating if a service type was identified
 */
function identifyServiceType(message: string): boolean {
  // List of common service types
  const serviceTypes = [
    'plumber', 'plumbing', 'electrician', 'electrical', 'carpenter', 'carpentry',
    'painter', 'painting', 'cleaning', 'cleaner', 'repair', 'fix', 'maintenance',
    'air conditioning', 'ac', 'air conditioner', 'hvac', 'gardener', 'gardening',
    'landscaping', 'moving', 'movers', 'pest control', 'renovation', 'construction',
    'installation', 'appliance', 'device', 'furniture', 'assembly', 'handyman',
    'locksmith', 'security', 'decoration', 'interior design', 'catering', 'event',
    'delivery', 'transportation', 'driver', 'tutor', 'teacher', 'lesson', 'class'
  ];
  
  const messageLower = message.toLowerCase();
  return serviceTypes.some(type => messageLower.includes(type));
}

/**
 * Generate a follow-up question based on missing information
 * @param hasLocation Whether the user provided a location
 * @param hasServiceType Whether the user specified a service type
 * @returns A follow-up question to gather more information
 */
function generateFollowUpQuestion(hasLocation: boolean, hasServiceType: boolean): string {
  if (!hasLocation && !hasServiceType) {
    return "I'd like to help you find the right service in Abu Dhabi. Could you please tell me what type of service you're looking for and which area in Abu Dhabi you're located in?";
  }
  
  if (!hasLocation) {
    return "I'd like to help you find that service. Could you please tell me which area in Abu Dhabi you're located in? This will help me find providers that serve your location.";
  }
  
  if (!hasServiceType) {
    return "I'd be happy to help you find services in that area. Could you please specify what type of service you're looking for?";
  }
  
  // This should not happen, but just in case
  return "Could you please provide more details about what you're looking for?";
}
