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
