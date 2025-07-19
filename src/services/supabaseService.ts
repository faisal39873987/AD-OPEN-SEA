import { supabase } from '@/lib/supabase';

/**
 * Save structured data to the services table
 * 
 * @param data - The JSON data to save to Supabase
 * @returns Promise with the insert result
 */
export async function saveStructuredData(data: any) {
  try {
    const { data: result, error } = await supabase
      .from('services')
      .insert(data)
      .select();
    
    if (error) {
      throw error;
    }
    
    return result;
  } catch (error) {
    console.error('Error saving data to Supabase:', error);
    throw new Error('Failed to save data to Supabase');
  }
}

/**
 * Get all services from the services table
 * 
 * @returns Promise with array of services
 */
export async function getAllServices() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching services from Supabase:', error);
    throw new Error('Failed to fetch services from Supabase');
  }
}

/**
 * Get a service by ID
 * 
 * @param id - The ID of the service to retrieve
 * @returns Promise with the service data
 */
export async function getServiceById(id: string) {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching service from Supabase:', error);
    throw new Error('Failed to fetch service from Supabase');
  }
}

/**
 * Update a service by ID
 * 
 * @param id - The ID of the service to update
 * @param data - The data to update
 * @returns Promise with the updated service
 */
export async function updateService(id: string, data: any) {
  try {
    const { data: result, error } = await supabase
      .from('services')
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) {
      throw error;
    }
    
    return result[0];
  } catch (error) {
    console.error('Error updating service in Supabase:', error);
    throw new Error('Failed to update service in Supabase');
  }
}

/**
 * Delete a service by ID
 * 
 * @param id - The ID of the service to delete
 * @returns Promise with the delete result
 */
export async function deleteService(id: string) {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting service from Supabase:', error);
    throw new Error('Failed to delete service from Supabase');
  }
}
