import { supabase } from './index';

/**
 * Session context interface
 */
export interface SessionContext {
  sessionId: string;
  serviceType?: string;
  location?: string;
  userIntent?: string;
}

/**
 * Extract location information from a message
 * @param message User message
 * @param chatHistory Previous messages for context
 * @returns Location string or undefined
 */
export function extractLocation(message: string, chatHistory: any[] = []): string | undefined {
  // List of Abu Dhabi locations/areas
  const abuDhabiLocations = [
    'abu dhabi', 'al reem', 'al reef', 'yas island', 'saadiyat', 'khalifa city',
    'masdar city', 'al raha', 'al bateen', 'corniche', 'al wahda', 'al danah',
    'al maryah', 'al ain', 'liwa', 'ghantoot', 'musaffah', 'baniyas', 'shahama',
    'al falah', 'al samha', 'al wathba', 'madinat zayed', 'hudayriat'
  ];
  
  // Check current message
  const messageLower = message.toLowerCase();
  const foundLocation = abuDhabiLocations.find(location => messageLower.includes(location));
  if (foundLocation) {
    return foundLocation;
  }
  
  // Check chat history for locations
  for (const msg of chatHistory) {
    if (msg.role === 'user') {
      const contentLower = msg.content.toLowerCase();
      const foundInHistory = abuDhabiLocations.find(location => contentLower.includes(location));
      if (foundInHistory) {
        return foundInHistory;
      }
    }
  }
  
  return undefined;
}

/**
 * Extract service type from a message
 * @param message User message
 * @returns Service type string or undefined
 */
export function extractServiceType(message: string): string | undefined {
  // List of common service types
  const serviceTypes = [
    { keyword: 'plumber', type: 'plumbing' },
    { keyword: 'plumbing', type: 'plumbing' },
    { keyword: 'electrician', type: 'electrical' },
    { keyword: 'electrical', type: 'electrical' },
    { keyword: 'carpenter', type: 'carpentry' },
    { keyword: 'carpentry', type: 'carpentry' },
    { keyword: 'painter', type: 'painting' },
    { keyword: 'painting', type: 'painting' },
    { keyword: 'cleaning', type: 'cleaning' },
    { keyword: 'cleaner', type: 'cleaning' },
    { keyword: 'repair', type: 'repair' },
    { keyword: 'fix', type: 'repair' },
    { keyword: 'maintenance', type: 'maintenance' },
    { keyword: 'air conditioning', type: 'ac repair' },
    { keyword: 'ac', type: 'ac repair' },
    { keyword: 'air conditioner', type: 'ac repair' },
    { keyword: 'hvac', type: 'ac repair' },
    { keyword: 'gardener', type: 'gardening' },
    { keyword: 'gardening', type: 'gardening' },
    { keyword: 'landscaping', type: 'gardening' },
    { keyword: 'moving', type: 'moving' },
    { keyword: 'movers', type: 'moving' },
    { keyword: 'pest control', type: 'pest control' },
    { keyword: 'renovation', type: 'renovation' },
    { keyword: 'construction', type: 'construction' }
  ];
  
  const messageLower = message.toLowerCase();
  const matchedService = serviceTypes.find(service => messageLower.includes(service.keyword));
  
  return matchedService?.type;
}

/**
 * Get session context from Supabase
 * @param sessionId Chat session ID
 * @returns Session context or null if not found
 */
export async function getSessionContext(sessionId: string): Promise<SessionContext | null> {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('session_id, service_type, location, user_intent')
      .eq('session_id', sessionId)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      sessionId: data.session_id,
      serviceType: data.service_type,
      location: data.location,
      userIntent: data.user_intent
    };
  } catch (error) {
    console.error('Error getting session context:', error);
    return null;
  }
}

/**
 * Update session context in Supabase
 * @param context Session context to update
 * @returns Boolean indicating success
 */
export async function updateSessionContext(context: SessionContext): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('update_session_context', {
        p_session_id: context.sessionId,
        p_service_type: context.serviceType,
        p_location: context.location,
        p_user_intent: context.userIntent
      });
    
    if (error) throw error;
    
    return data === true;
  } catch (error) {
    console.error('Error updating session context:', error);
    return false;
  }
}

/**
 * Update context based on user message
 * @param sessionId Chat session ID
 * @param message User message
 * @param chatHistory Previous chat messages
 * @returns Updated session context
 */
export async function processMessageContext(
  sessionId: string,
  message: string,
  chatHistory: any[] = []
): Promise<SessionContext | null> {
  try {
    // Extract information from message
    const location = extractLocation(message, chatHistory);
    const serviceType = extractServiceType(message);
    
    // No useful information found
    if (!location && !serviceType) {
      return null;
    }
    
    // Get existing context
    const existingContext = await getSessionContext(sessionId);
    
    // Create updated context
    const updatedContext: SessionContext = {
      sessionId,
      serviceType: serviceType || existingContext?.serviceType,
      location: location || existingContext?.location,
      userIntent: existingContext?.userIntent
    };
    
    // Update in database
    await updateSessionContext(updatedContext);
    
    return updatedContext;
  } catch (error) {
    console.error('Error processing message context:', error);
    return null;
  }
}
