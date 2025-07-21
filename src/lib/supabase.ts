import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          id: string
          event_type: string
          event_data: Record<string, unknown>
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          event_data?: Record<string, unknown>
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          event_data?: Record<string, unknown>
          user_id?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          read?: boolean
          created_at?: string
        }
      }
      service_providers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          category: string
          description: string | null
          hourly_rate: number | null
          available: boolean
          rating: number | null
          total_reviews: number
          profile_image: string | null
          location: string | null
          skills: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          category: string
          description?: string | null
          hourly_rate?: number | null
          available?: boolean
          rating?: number | null
          total_reviews?: number
          profile_image?: string | null
          location?: string | null
          skills?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          category?: string
          description?: string | null
          hourly_rate?: number | null
          available?: boolean
          rating?: number | null
          total_reviews?: number
          profile_image?: string | null
          location?: string | null
          skills?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          service_provider_id: string
          service_type: string
          status: string
          scheduled_at: string
          total_amount: number
          payment_status: string
          special_instructions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_provider_id: string
          service_type: string
          status?: string
          scheduled_at: string
          total_amount: number
          payment_status?: string
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_provider_id?: string
          service_type?: string
          status?: string
          scheduled_at?: string
          total_amount?: number
          payment_status?: string
          special_instructions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          user_id: string
          service_provider_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          user_id: string
          service_provider_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          user_id?: string
          service_provider_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

/**
 * Interface for service search results
 */
export interface ServiceSearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  phone?: string;
  location?: string;
  rating?: number;
}

/**
 * Interface for chat log entry
 */
export interface ChatLogEntry {
  id?: string;
  user_id: string;
  question: string;
  answer: string;
  source: 'supabase' | 'openai';
  created_at?: string;
}

/**
 * Search for services in Supabase that match the user's query
 * @param query User's search query
 * @param limit Maximum number of results to return (default: 3)
 * @returns Array of matching services or null if none found
 */
export async function searchServicesByQuery(query: string, limit: number = 3): Promise<ServiceSearchResult[] | null> {
  try {
    // Clean and prepare the query
    const searchTerms = query
      .toLowerCase()
      .replace(/[^\w\s]/gi, '') // Remove special characters
      .split(' ')
      .filter(term => term.length > 2 && !['the', 'and', 'for', 'how', 'what', 'where', 'when', 'who', 'why'].includes(term))
      .map(term => term + ':*')  // Add wildcard for prefix matching
      .join(' & ');
    
    // If no valid search terms after filtering, use a simpler approach
    const searchQuery = searchTerms || query.toLowerCase();
    
    // Try full-text search first if we have valid search terms
    if (searchTerms) {
      const { data: ftData, error: ftError } = await supabase
        .from('services')
        .select('id, name, description, category, phone, location, rating')
        .textSearch('description', searchQuery, {
          type: 'websearch',
          config: 'english'
        })
        .limit(limit);
      
      if (!ftError && ftData && ftData.length > 0) {
        return ftData as ServiceSearchResult[];
      }
    }
    
    // Fallback to more basic ILIKE search
    const searchWords = query
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(' ')
      .filter(word => word.length > 2);
    
    if (searchWords.length > 0) {
      let filters = searchWords.map(word => `name.ilike.%${word}%`).join(',');
      
      const { data, error } = await supabase
        .from('services')
        .select('id, name, description, category, phone, location, rating')
        .or(filters)
        .limit(limit);
      
      if (!error && data && data.length > 0) {
        return data as ServiceSearchResult[];
      }
    }
    
    // Last attempt: Try category matching
    const { data: categoryData, error: categoryError } = await supabase
      .from('services')
      .select('id, name, description, category, phone, location, rating')
      .ilike('category', `%${query}%`)
      .limit(limit);
    
    if (!categoryError && categoryData && categoryData.length > 0) {
      return categoryData as ServiceSearchResult[];
    }
    
    // No results found
    return null;
  } catch (error) {
    console.error('Error searching services:', error);
    return null;
  }
}

/**
 * Log a chat session to the chat_log table
 * @param userId User ID (or "anonymous" if not logged in)
 * @param question User's question
 * @param answer System's answer
 * @param source Source of the answer ("supabase" or "openai")
 * @returns Boolean indicating success
 */
export async function logChatSession(
  userId: string,
  question: string,
  answer: string,
  source: 'supabase' | 'openai'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('chat_log')
      .insert({
        user_id: userId || 'anonymous',
        question,
        answer,
        source,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error logging chat session:', error);
    return false;
  }
}
