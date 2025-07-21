import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchServicesByQuery, logChatSession, supabase } from '../src/lib/supabase';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => {
  const mockSelect = vi.fn();
  const mockTextSearch = vi.fn();
  const mockOr = vi.fn();
  const mockIlike = vi.fn();
  const mockLimit = vi.fn();
  const mockFrom = vi.fn();
  const mockInsert = vi.fn();
  
  return {
    createClient: () => ({
      from: mockFrom.mockImplementation(() => ({
        select: mockSelect.mockImplementation(() => ({
          textSearch: mockTextSearch.mockImplementation(() => ({
            limit: mockLimit.mockImplementation(() => ({ 
              data: [], 
              error: null 
            }))
          })),
          or: mockOr.mockImplementation(() => ({
            limit: mockLimit.mockImplementation(() => ({ 
              data: [], 
              error: null 
            }))
          })),
          ilike: mockIlike.mockImplementation(() => ({
            limit: mockLimit.mockImplementation(() => ({ 
              data: [], 
              error: null 
            }))
          })),
          limit: mockLimit.mockImplementation(() => ({ 
            data: [], 
            error: null 
          }))
        })),
        insert: mockInsert.mockImplementation(() => ({
          error: null
        }))
      }))
    }),
  };
});

describe('Supabase Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  describe('searchServicesByQuery', () => {
    it('should return null when no services are found', async () => {
      // Mock implementation for this test case
      const mockFrom = vi.spyOn(supabase, 'from');
      mockFrom.mockImplementation(() => ({
        select: () => ({
          textSearch: () => ({
            limit: () => ({ data: [], error: null })
          }),
          or: () => ({
            limit: () => ({ data: [], error: null })
          }),
          ilike: () => ({
            limit: () => ({ data: [], error: null })
          })
        })
      }));
      
      const result = await searchServicesByQuery('non-existent service');
      expect(result).toBeNull();
    });
    
    it('should return services when matching results are found', async () => {
      // Sample data for test
      const mockServices = [
        { 
          id: '1', 
          name: 'Test Plumber', 
          description: 'Plumbing service', 
          category: 'plumber',
          phone: '123456789',
          location: 'Abu Dhabi',
          rating: 4.5
        }
      ];
      
      // Mock implementation for this test case
      const mockFrom = vi.spyOn(supabase, 'from');
      mockFrom.mockImplementation(() => ({
        select: () => ({
          textSearch: () => ({
            limit: () => ({ data: mockServices, error: null })
          }),
          or: () => ({
            limit: () => ({ data: [], error: null })
          }),
          ilike: () => ({
            limit: () => ({ data: [], error: null })
          })
        })
      }));
      
      const result = await searchServicesByQuery('plumber');
      expect(result).toEqual(mockServices);
    });
    
    it('should handle database errors gracefully', async () => {
      // Mock implementation for this test case to simulate an error
      const mockFrom = vi.spyOn(supabase, 'from');
      mockFrom.mockImplementation(() => ({
        select: () => ({
          textSearch: () => ({
            limit: () => ({ data: null, error: new Error('Database error') })
          }),
          or: () => ({
            limit: () => ({ data: null, error: new Error('Database error') })
          }),
          ilike: () => ({
            limit: () => ({ data: null, error: new Error('Database error') })
          })
        })
      }));
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = await searchServicesByQuery('plumber');
      expect(result).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('logChatSession', () => {
    it('should return true when chat session is logged successfully', async () => {
      const mockFrom = vi.spyOn(supabase, 'from');
      mockFrom.mockImplementation(() => ({
        insert: () => ({ error: null })
      }));
      
      const result = await logChatSession(
        'user123',
        'Looking for a plumber',
        'I found 3 plumbers in Abu Dhabi',
        'supabase'
      );
      
      expect(result).toBe(true);
    });
    
    it('should return false when chat logging fails', async () => {
      const mockFrom = vi.spyOn(supabase, 'from');
      mockFrom.mockImplementation(() => ({
        insert: () => ({ error: new Error('Database error') })
      }));
      
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = await logChatSession(
        'user123',
        'Looking for a plumber',
        'I found 3 plumbers in Abu Dhabi',
        'supabase'
      );
      
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
    
    it('should use "anonymous" when userId is not provided', async () => {
      const mockInsert = vi.fn().mockReturnValue({ error: null });
      const mockFrom = vi.spyOn(supabase, 'from');
      mockFrom.mockImplementation(() => ({
        insert: mockInsert
      }));
      
      await logChatSession(
        '',
        'Looking for a plumber',
        'I found 3 plumbers in Abu Dhabi',
        'supabase'
      );
      
      expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 'anonymous'
      }));
    });
  });
});
