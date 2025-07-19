// Types for AD PLUS Assistant database tables
export type ServiceCategory = 
  | 'personal_trainers' 
  | 'yacht_rentals' 
  | 'apartments' 
  | 'beauty_clinics' 
  | 'kids_services' 
  | 'housekeeping';

export type ResponseSource = 'supabase' | 'gpt';

export interface Service {
  id: string;
  category: ServiceCategory;
  provider_name: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  whatsapp: string | null;
  instagram: string | null;
  contact: string | null;
  website: string | null;
  image_url: string | null;
  location: string | null;
  created_at: string;
}

export interface UserRequest {
  id: string;
  user_id: string | null;
  user_input: string;
  response: string;
  source: ResponseSource;
  created_at: string;
}

export interface UserFeedback {
  id: string;
  user_id: string | null;
  service_id: string | null;
  rating: number;
  feedback: string | null;
  created_at: string;
}
