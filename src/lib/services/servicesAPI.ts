import { supabase } from '@/lib/supabase';
import { Service, ServiceCategory, UserRequest, UserFeedback } from '@/lib/types/database';

export class ServicesAPI {
  /**
   * Search for services by category and optional query
   */
  static async searchServices(
    category: ServiceCategory,
    query?: string
  ): Promise<Service[]> {
    try {
      let serviceQuery = supabase
        .from('services')
        .select('*')
        .eq('category', category);

      // If a search query is provided, filter by description or provider name
      if (query && query.trim() !== '') {
        const searchTerm = `%${query.toLowerCase()}%`;
        serviceQuery = serviceQuery.or(
          `description.ilike.${searchTerm},provider_name.ilike.${searchTerm}`
        );
      }

      const { data, error } = await serviceQuery;

      if (error) {
        console.error('Error searching services:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception in searchServices:', error);
      return [];
    }
  }

  /**
   * Get service details by ID
   */
  static async getServiceById(id: string): Promise<Service | null> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error getting service by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception in getServiceById:', error);
      return null;
    }
  }

  /**
   * Save a user request and its response
   */
  static async saveUserRequest(
    userInput: string,
    response: string,
    source: 'supabase' | 'gpt',
    userId?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_requests')
        .insert({
          user_id: userId || null,
          user_input: userInput,
          response: response,
          source: source
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving user request:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Exception in saveUserRequest:', error);
      return null;
    }
  }

  /**
   * Save user feedback for a service
   */
  static async saveUserFeedback(
    rating: number,
    feedback: string | null,
    serviceId: string | null,
    userId?: string
  ): Promise<string | null> {
    try {
      // Validate rating
      if (rating < 1 || rating > 5) {
        console.error('Invalid rating. Must be between 1 and 5.');
        return null;
      }

      const { data, error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: userId || null,
          service_id: serviceId,
          rating: rating,
          feedback: feedback
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving user feedback:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Exception in saveUserFeedback:', error);
      return null;
    }
  }

  /**
   * Get feedback for a specific service
   */
  static async getServiceFeedback(serviceId: string): Promise<UserFeedback[]> {
    try {
      const { data, error } = await supabase
        .from('user_feedback')
        .select('*')
        .eq('service_id', serviceId);

      if (error) {
        console.error('Error getting service feedback:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception in getServiceFeedback:', error);
      return [];
    }
  }

  /**
   * Get user request history
   */
  static async getUserRequestHistory(userId: string, limit = 10): Promise<UserRequest[]> {
    try {
      const { data, error } = await supabase
        .from('user_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting user request history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Exception in getUserRequestHistory:', error);
      return [];
    }
  }
}
