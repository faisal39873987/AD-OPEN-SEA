import { supabase } from './index';

interface ServiceResult {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  location?: string;
  rating?: number;
  image_url?: string;
}

/**
 * Search for services in Supabase that match the user's query using full-text search
 * @param query The user's search query
 * @param limit Maximum number of results to return (default: 3)
 * @returns Array of matching services or null if none found
 */
export async function searchServices(query: string, limit: number = 3): Promise<ServiceResult[] | null> {
  try {
    // Prepare search terms by removing common words and adding wildcards
    const searchTerms = query
      .toLowerCase()
      .replace(/[^\w\s]/gi, '') // Remove special characters
      .split(' ')
      .filter(term => term.length > 2 && !['the', 'and', 'for', 'how', 'what', 'where', 'when', 'who', 'why'].includes(term))
      .map(term => term + ':*')  // Add wildcard for prefix matching
      .join(' & ');
    
    // If no valid search terms after filtering, use a more basic approach
    const searchQuery = searchTerms || query.toLowerCase();
    
    // First try full-text search if we have valid search terms
    if (searchTerms) {
      const { data: ftData, error: ftError } = await supabase
        .from('services')
        .select('*')
        .textSearch('description', searchQuery, {
          type: 'websearch',
          config: 'english'
        })
        .limit(limit);
      
      if (!ftError && ftData && ftData.length > 0) {
        return ftData as ServiceResult[];
      }
    }
    
    // Fallback to more basic ILIKE search for each significant word
    const searchWords = query
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(' ')
      .filter(word => word.length > 2);
    
    if (searchWords.length > 0) {
      let filters = searchWords.map(word => `name.ilike.%${word}%`).join(',');
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .or(filters)
        .limit(limit);
      
      if (!error && data && data.length > 0) {
        return data as ServiceResult[];
      }
    }
    
    // If still no results, try category matching
    const { data: categoryData, error: categoryError } = await supabase
      .from('services')
      .select('*')
      .ilike('category', `%${query}%`)
      .limit(limit);
    
    if (!categoryError && categoryData && categoryData.length > 0) {
      return categoryData as ServiceResult[];
    }
    
    // No results found
    return null;
  } catch (error) {
    console.error('Error searching services:', error);
    return null;
  }
}

/**
 * Get service recommendations based on category or popularity
 * @param category Optional category to filter by
 * @param limit Maximum number of recommendations to return
 * @returns Array of recommended services
 */
export async function getServiceRecommendations(
  category?: string,
  limit: number = 3
): Promise<ServiceResult[] | null> {
  try {
    let query = supabase.from('services').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    // Order by rating (descending) and limit results
    const { data, error } = await query
      .order('rating', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data as ServiceResult[];
  } catch (error) {
    console.error('Error getting service recommendations:', error);
    return null;
  }
}
