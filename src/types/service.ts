export interface Service {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  contact: string;
  website?: string;
  whatsapp?: string;
  instagram?: string;
  image_url?: string;
  location: string;
  created_at: string;
}

export interface UserRequest {
  id: string;
  user_id: string;
  user_input: string;
  response: string;
  source: 'supabase' | 'gpt';
  created_at: string;
}

export interface UserFeedback {
  id: string;
  user_id: string;
  service_id: string;
  rating: number;
  feedback: string;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  payment_status: 'paid' | 'failed';
  status: 'confirmed' | 'payment_failed';
  created_at: string;
  updated_at: string;
}

export const SERVICE_CATEGORIES = [
  'Personal trainers',
  'Yacht rentals',
  'Apartment rentals',
  'Beauty clinics',
  'Kids services',
  'Housekeeping'
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];
