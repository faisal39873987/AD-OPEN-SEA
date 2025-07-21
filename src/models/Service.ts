import { createClient } from '@/lib/supabase/client';

export interface Service {
  id: string;
  service_category: string;
  name: string;
  description: string | null;
  price: number | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  location: string | null;
  available: boolean;
  created_at: string;
}

export interface ServiceFormData {
  service_category: string;
  name: string;
  description: string;
  price: number | string;
  phone: string;
  whatsapp: string;
  instagram: string;
  location: string;
  available: boolean;
}

export const SERVICE_CATEGORIES = [
  'مدربين خاصين',
  'خدم منازل',
  'سائقين',
  'رعاية أطفال',
  'صيانة منزلية',
  'دروس خصوصية',
  'تنظيف',
  'طبخ',
  'تجميل',
  'أخرى'
];

export async function fetchServices(category?: string): Promise<Service[]> {
  const supabase = createClient();
  
  let query = supabase.from('services').select('*');
  
  if (category) {
    query = query.eq('service_category', category);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching services:', error);
    throw new Error(error.message);
  }
  
  return data || [];
}

export async function fetchServiceById(id: string): Promise<Service | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching service:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createService(service: ServiceFormData): Promise<Service> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('services')
    .insert([{
      ...service,
      price: service.price ? parseFloat(service.price.toString()) : null
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating service:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function updateService(id: string, service: ServiceFormData): Promise<Service> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('services')
    .update({
      ...service,
      price: service.price ? parseFloat(service.price.toString()) : null
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating service:', error);
    throw new Error(error.message);
  }
  
  return data;
}

export async function deleteService(id: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting service:', error);
    throw new Error(error.message);
  }
}
